const preferredOrder = [
    "broiler_cut",
    "broiler_live",
    "culbird_cut",
    "culbird_live"
];

function logSale(type, kg) {
    const allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    allSales.push({
        type: type,
        kg: kg,
        time: new Date().toISOString()
    });

    localStorage.setItem("salesLog", JSON.stringify(allSales));
}

// Build daily × type table data
function getDailySalesReport() {
    const allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    const summary = {};      // summary[date][type] = total kg
    const allTypes = new Set();

    allSales.forEach(entry => {
        const date = entry.time.split("T")[0]; // YYYY-MM-DD
        allTypes.add(entry.type);

        if (!summary[date]) summary[date] = {};
        if (!summary[date][entry.type]) summary[date][entry.type] = 0;

        summary[date][entry.type] += entry.kg;
    });

    return { summary, types: Array.from(allTypes) };
}

// Convert the data into an HTML table
function showReport() {
    const { summary, types } = getDailySalesReport();

    if (types.length === 0) {
        document.getElementById("reportBox").innerHTML = `
            <div class="no-data">No sales recorded.</div>
        `;
        return;
    }

    let html = `
        <h3 class="report-title">Daily Sales Report (KG)</h3>
        <div class="table-container">
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Date</th>
    `;

    const orderedTypes = [
        ...preferredOrder.filter(t => types.includes(t)),
        ...types.filter(t => !preferredOrder.includes(t)).sort()
    ];

    orderedTypes.forEach(type => {
        html += `<th>${formatTypeName(type)
        }</th>`;
    });

    html += `
                    </tr>
                </thead>
                <tbody>
    `;

    Object.keys(summary).sort().forEach(date => {
        html += `<tr><td>${date}</td>`;

        orderedTypes.forEach(type => {
            const value = summary[date][type] || 0;
            html += `<td>${value}</td>`;
        });

        html += `</tr>`;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    document.getElementById("reportBox").innerHTML = html;
}


function clearSalesReport() {
    localStorage.removeItem("salesLog");
}

function formatTypeName(type) {
    return type
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
