function logSale(type, kg) {
    const allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    allSales.push({
        type: type,
        kg: kg,
        time: new Date().toISOString()
    });

    localStorage.setItem("salesLog", JSON.stringify(allSales));
}

function getSalesReport() {
    const allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    const summary = {};

    allSales.forEach(entry => {
        if (!summary[entry.type]) {
            summary[entry.type] = 0;
        }
        summary[entry.type] += entry.kg;
    });

    return summary;
}


function showReport() {
    const report = getSalesReport();
    let html = "<h3>KG Sold Report</h3><ul>";

    for (const type in report) {
        html += `<li>${type}: <b>${report[type]} kg</b></li>`;
    }

    html += "</ul>";

    document.getElementById("reportBox").innerHTML = html;
}


function clearSalesReport() {
    localStorage.removeItem("salesLog");
}
