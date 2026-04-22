Papa.parse("data/Controlprocesos_neps.csv", {
    download: true,
    header: true,
    complete: function(results) {

        const data = results.data.filter(r => r.PROCESO);

        // KPIs
        document.getElementById("totalProcesos").innerHTML =
            "✅ Total procesos: <b>" + data.length + "</b>";

        const errores = data.filter(r => r.ESTADO === "ERROR").length;
        document.getElementById("procesosError").innerHTML =
            "❌ Procesos con error: <b>" + errores + "</b>";

        const duracionAvg = data.reduce((a,b) => a + parseFloat(b.DURACIONMIN.replace(",",".")),0)/data.length;
        document.getElementById("duracionPromedio").innerHTML =
            "⏱ Promedio (min): <b>" + duracionAvg.toFixed(2) + "</b>";

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

        // Tabla
        $('#tablaProcesos').DataTable({
            data: data,
            columns: Object.keys(data[0]).map(c => ({title:c, data:c}))
        });
    }
});