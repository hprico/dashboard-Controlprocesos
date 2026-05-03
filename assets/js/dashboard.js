// ====================================
// 1️⃣ FUNCIONES UTILITARIAS
// ====================================

function duracionTextoASegundos(texto) {
    if (!texto || typeof texto !== "string") return NaN;

    let h = 0, m = 0, s = 0;

    const hMatch = texto.match(/(\d+)\s*h/i);
    const mMatch = texto.match(/(\d+)\s*m/i);
    const sMatch = texto.match(/(\d+)\s*s/i);

    if (hMatch) h = parseInt(hMatch[1], 10);
    if (mMatch) m = parseInt(mMatch[1], 10);
    if (sMatch) s = parseInt(sMatch[1], 10);

    return h * 3600 + m * 60 + s;
}

function segundosATexto(seg) {
    const h = Math.floor(seg / 3600);
    const m = Math.floor((seg % 3600) / 60);
    const s = Math.floor(seg % 60);

    let resultado = [];
    if (h > 0) resultado.push(`${h}h`);
    if (m > 0) resultado.push(`${m}m`);
    resultado.push(`${s}s`);

    return resultado.join(" ");
}

function calcularPercentil(valores, p) {
    if (valores.length === 0) return NaN;

    const ordenados = [...valores].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * ordenados.length) - 1;

    return ordenados[index];
}


// ====================================
// 2️⃣ CONFIGURACIÓN GLOBAL
// ====================================

const UMBRAL_CRITICO_SEG = 2 * 3600; // 2 horas


// ====================================
// 3️⃣ CARGA Y PROCESAMIENTO DE DATA
// ====================================

Papa.parse("data/Controlprocesos_neps.csv", {
    download: true,
    header: true,
    complete: function (results) {

        const data = results.data.filter(r => r.PROCESO);

        const UMBRAL_CRITICO_SEG = 2 * 3600; // 2 horas

        // =======================
        // KPIs BASE
        // =======================

        document.getElementById("totalProcesos").innerHTML =
            "✅ Total procesos<b>" + data.length + "</b>";

        const errores = data.filter(r => r.ESTADO === "ERROR").length;
        document.getElementById("procesosError").innerHTML =
            "❌ Procesos con error<b>" + errores + "</b>";

        // =======================
        // DURACIONES (NUEVA LÓGICA UNIFICADA)
        // =======================

        const duracionesSeg = data
            .map(r => duracionTextoASegundos(r.DURACION))
            .filter(v => !isNaN(v));

        const minSeg = Math.min(...duracionesSeg);
        const maxSeg = Math.max(...duracionesSeg);

        document.getElementById("tiempoMinimo").innerHTML =
            "⏱ Tiempo mínimo<b>" + segundosATexto(minSeg) + "</b>";

        document.getElementById("tiempoMaximo").innerHTML =
            "⏱ Tiempo máximo<b>" + segundosATexto(maxSeg) + "</b>";

        // ALERTA VISUAL
        if (maxSeg >= UMBRAL_CRITICO_SEG) {
            document.getElementById("tiempoMaximo")
                .classList.add("alerta-roja");
        }

        // =======================
        // PERCENTILES
        // =======================

        const p90 = calcularPercentil(duracionesSeg, 90);
        const p95 = calcularPercentil(duracionesSeg, 95);

        document.getElementById("percentiles").innerHTML = `
            <div class="kpi-card">
                📊 P90<b>${segundosATexto(p90)}</b>
            </div>
            <div class="kpi-card">
                📊 P95<b>${segundosATexto(p95)}</b>
            </div>
        `;

        // =======================
        // PROCESOS ANORMALES (>P95)
        // =======================

        const procesosAnormales = data.filter(r =>
            duracionTextoASegundos(r.DURACION) > p95
        );

        // =======================
        // FECHA ACTUALIZACIÓN
        // =======================

        const fechas = data
            .map(r => (r.FECHAINICIO || "").substring(0, 10))
            .filter(f => f);

        fechas.sort((a, b) => {
            const [da, ma, ya] = a.split("/");
            const [db, mb, yb] = b.split("/");
            return `${yb}${mb}${db}`.localeCompare(`${ya}${ma}${da}`);
        });

        document.getElementById("fechaActualizacion").innerHTML =
            "📅 Fecha de actualización de la data: <b>" +
            (fechas[0] || "No disponible") +
            "</b>";

        // =======================
        // GRÁFICOS
        // =======================

        const estados = {};
        data.forEach(r => estados[r.ESTADO] = (estados[r.ESTADO] || 0) + 1);

        Plotly.newPlot("chartEstados", [{
            labels: Object.keys(estados),
            values: Object.values(estados),
            type: "pie",
            marker: { colors: ['#28a745', '#dc3545', '#ffc107', '#17a2b8'] },
            textinfo: 'percent',
            textposition: 'inside'
        }], { 
            title: { text: '📊 Procesos por Estado', font: { size: 16 }, x: 0, align: 'left' },
            showlegend: true,
            margin: { t: 40, l: 20, r: 20, b: 20 }
        });

        const servidores = {};
        data.forEach(r => servidores[r.SERVIDOR] = (servidores[r.SERVIDOR] || 0) + 1);

        Plotly.newPlot("chartServidores", [{
            x: Object.keys(servidores),
            y: Object.values(servidores),
            type: "bar",
            marker: { color: '#007bff', opacity: 0.8 }
        }], { 
            title: { text: '🖥️ Procesos por Servidor', font: { size: 16 }, x: 0, align: 'left' },
            xaxis: { title: 'Servidor' },
            yaxis: { title: 'Cantidad' },
            margin: { t: 40, l: 50, r: 20, b: 40 }
        });

        // TOP 10 DURACIÓN (NUEVO MÉTODO)
        const top10 = [...data]
            .filter(r => !isNaN(duracionTextoASegundos(r.DURACION)))
            .sort((a, b) =>
                duracionTextoASegundos(b.DURACION) -
                duracionTextoASegundos(a.DURACION)
            )
            .slice(0, 10);

        Plotly.newPlot("chartTopDuracion", [{
            x: top10.map(r => r.PROCESO).slice(0, 5),
            y: top10.map(r => duracionTextoASegundos(r.DURACION) / 60).slice(0, 5),
            type: "bar",
            marker: { color: '#dc3545', opacity: 0.8 }
        }], { 
            title: { text: '⏱️ Top 5 Procesos más largos (min)', font: { size: 16 }, x: 0, align: 'left' },
            xaxis: { title: 'Proceso' },
            yaxis: { title: 'Duración (min)' },
            margin: { t: 40, l: 50, r: 20, b: 60 }
        });

        // =======================
        // BASES DE DATOS
        // =======================

        const bases = {};
        data.forEach(r => {
            const bd = r.BASE_DATOS?.trim() || "NO DEFINIDA";
            bases[bd] = (bases[bd] || 0) + 1;
        });

        const ordenadas = Object.entries(bases).sort((a, b) => b[1] - a[1]);
        const top7 = ordenadas.slice(0, 7);
        const otras = ordenadas.slice(7).reduce((s, e) => s + e[1], 0);

        const labels = top7.map(e => e[0]);
        const values = top7.map(e => e[1]);
        if (otras > 0) { labels.push("OTRAS"); values.push(otras); }

        Plotly.newPlot("chartBaseDatos", [{
            labels, values, type: "pie", hole: 0.4,
            marker: { colors: ['#6610f2', '#e83e8c', '#28a745', '#ffc107', '#17a2b8', '#6f42c1', '#fd7e14', '#6c757d'] },
            textinfo: 'percent',
            textposition: 'inside'
        }], { 
            title: { text: '🛢️ Bases de Datos', font: { size: 16 }, x: 0, align: 'left' },
            showlegend: true,
            margin: { t: 40, l: 20, r: 20, b: 20 }
        });

        // =======================
        // TABLA
        // =======================

        $('#tablaProcesos').DataTable({
            destroy: true,
            data,
            columns: Object.keys(data[0]).map(c => ({ title: c, data: c }))
        });
    }
});
