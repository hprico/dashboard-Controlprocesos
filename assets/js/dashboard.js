Papa.parse("data/Controlprocesos_neps.csv", {
    download: true,
    header: true,
    complete: function(results) {

        const data = results.data.filter(r => r.PROCESO);

        // KPIs 
        // Total procesos
        document.getElementById("totalProcesos").innerHTML =
            "✅ Total procesos<b>" + data.length + "</b>";
        
        // Procesos con error
        const errores = data.filter(r => r.ESTADO === "ERROR").length;
        document.getElementById("procesosError").innerHTML =
            "❌ Procesos con error<b>" + errores + "</b>";
        
        // Duraciones válidas
        const duraciones = data
            .map(r => parseFloat((r.DURACIONMIN || "0").replace(",", ".")))
            .filter(v => !isNaN(v));
        
        const minDuracion = Math.min(...duraciones);
        const maxDuracion = Math.max(...duraciones);
        
        document.getElementById("tiempoMinimo").innerHTML =
            "⏱ Tiempo mínimo (min)<b>" + minDuracion.toFixed(2) + "</b>";
        
        document.getElementById("tiempoMaximo").innerHTML =
            "⏱ Tiempo máximo (min)<b>" + maxDuracion.toFixed(2) + "</b>";
        
        // ===== Fecha de actualización de la data (DD/MM/YYYY) =====
        // Extraer solo la fecha (DD/MM/YYYY) de FECHAINICIO
        const fechasTexto = data
            .map(r => (r.FECHAINICIO || "").trim())
            .filter(f => f.length >= 10)
            .map(f => f.substring(0, 10)); // DD/MM/YYYY
        
        // Convertir DD/MM/YYYY a YYYYMMDD para poder comparar
        const fechasOrdenables = fechasTexto.map(f => {
            const [dd, mm, yyyy] = f.split("/");
            return {
                original: f,
                orden: `${yyyy}${mm}${dd}`
            };
        });
        
        // Obtener la fecha más reciente
        if (fechasOrdenables.length > 0) {
            fechasOrdenables.sort((a, b) => b.orden.localeCompare(a.orden));
        
            document.getElementById("fechaActualizacion").innerHTML =
                "📅 Fecha de actualización de la data: <b>" +
                fechasOrdenables[0].original +
                "</b>";
        } else {
            document.getElementById("fechaActualizacion").innerHTML =
                "📅 Fecha de actualización de la data: <b>No disponible</b>";
        }

        // Gráfico por estado
        const estados = {};
        data.forEach(r => estados[r.ESTADO] = (estados[r.ESTADO] || 0) + 1);

        Plotly.newPlot("chartEstados", [{
            values: Object.values(estados),
            labels: Object.keys(estados),
            type: 'pie'
        }], { title: "Procesos por Estado" });

        // Gráfico por servidor
        const servidores = {};
        data.forEach(r => servidores[r.SERVIDOR] = (servidores[r.SERVIDOR] || 0) + 1);

        Plotly.newPlot("chartServidores", [{
            x: Object.keys(servidores),
            y: Object.values(servidores),
            type: 'bar'
        }], { title: "Procesos por Servidor" });

        // Top procesos más largos
        const top = data
            .sort((a,b) => parseFloat(b.DURACIONMIN.replace(",",".")) - parseFloat(a.DURACIONMIN.replace(",",".")))
            .slice(0,10);

        Plotly.newPlot("chartTopDuracion", [{
            x: top.map(r => r.PROCESO),
            y: top.map(r => parseFloat(r.DURACIONMIN.replace(",","."))),
            type: 'bar'
        }], { title: "Top 10 Procesos más largos", xaxis:{tickangle:-45} });

        //console.log("➡️ Entrando a gráfico de Base de Datos");
        // Gráfico: Top 7 Bases de Datos + OTRAS
        // 1. Contar procesos por BASE_DATOS
        const basesCount = {};
        
        data.forEach(r => {
            const bd = (r.BASE_DATOS && r.BASE_DATOS.trim())
                ? r.BASE_DATOS
                : "NO DEFINIDA";
        
            basesCount[bd] = (basesCount[bd] || 0) + 1;
        });
        
        // 2. Convertir a array y ordenar de mayor a menor
        const basesOrdenadas = Object.entries(basesCount)
            .sort((a, b) => b[1] - a[1]);
        
        // 3. Tomar Top 7
        const top7 = basesOrdenadas.slice(0, 7);
        
        // 4. Sumar el resto como OTRAS
        const otras = basesOrdenadas
            .slice(7)
            .reduce((sum, item) => sum + item[1], 0);
        
        // 5. Construir labels y valores finales
        const labels = top7.map(item => item[0]);
        const values = top7.map(item => item[1]);
        
        if (otras > 0) {
            labels.push("OTRAS");
            values.push(otras);
        }
        
        // 6. Crear gráfico de torta (dona)
        Plotly.newPlot("chartBaseDatos", [{
            labels: labels,
            values: values,
            type: "pie",
            hole: 0.35
        }], {
            title: "Top 7 Bases de Datos + Otras",
            height: 450
        });
        //console.log("✅ Gráfico de Base de Datos creado");

        // Tabla
        $('#tablaProcesos').DataTable({
            data: data,
            columns: Object.keys(data[0]).map(c => ({title:c, data:c}))
        });
    }
});
