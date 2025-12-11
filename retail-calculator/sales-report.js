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
            html += `<td class="clickable-cell" onclick="showTransactions('${date}', '${type}')">${value}</td>`;
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


// transaction per day and delete

let modalDate = "";
let modalType = "";


function showTransactions(date, type) {
    modalDate = date;
    modalType = type;

    const allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    // Filter matching records
    const list = allSales.filter(entry =>
        entry.type === type && entry.time.startsWith(date)
    );

    document.getElementById("modalTitle").innerText =
        `${formatTypeName(type)} — ${date}`;

    let html = "";

    if (list.length === 0) {
        html = "<p>No transactions found.</p>";
    } else {
        list.forEach((entry) => {
            const timeString = entry.time;
            const displayTime = timeString.split("T")[1].slice(0,5);

            html += `
            <div class="transaction-item">
                <div>
                    <b>${entry.kg} kg</b>
                    <br><small>${displayTime}</small>
                </div>

                <div style="display:flex; gap:6px;">
                    <button class="edit-btn" onclick="editTransaction('${timeString}', ${entry.kg})">Edit</button>
                    <button class="delete-btn" onclick="deleteTransaction('${timeString}')">Delete</button>
                </div>
            </div>
            `;
        });
    }

    document.getElementById("transactionList").innerHTML = html;
    document.getElementById("transactionModal").style.display = "flex";
}


function editTransaction(timeKey, oldKg) {
    const newKg = prompt("Enter new KG value:", oldKg);

    if (newKg === null || newKg.trim() === "" || isNaN(newKg)) return;

    let allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    const updated = allSales.map(entry =>
        entry.time === timeKey ? { ...entry, kg: Number(newKg) } : entry
    );

    localStorage.setItem("salesLog", JSON.stringify(updated));

    showTransactions(modalDate, modalType); // refresh modal
    showReport(); // refresh table
}


function deleteTransaction(timeKey) {
    if (!confirm("Delete this record?")) return;

    let allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");
    allSales = allSales.filter(entry => entry.time !== timeKey);

    localStorage.setItem("salesLog", JSON.stringify(allSales));

    showTransactions(modalDate, modalType);
    showReport();
}

function addTransaction() {
    const kg = Number(document.getElementById("newKgInput").value);

    if (!kg || kg <= 0) {
        alert("Enter valid KG amount.");
        return;
    }

    let allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    // Force timestamp for the chosen DATE
    const timestamp = modalDate + "T" + new Date().toISOString().split("T")[1];

    allSales.push({
        type: modalType,
        kg: kg,
        time: timestamp
    });

    localStorage.setItem("salesLog", JSON.stringify(allSales));

    document.getElementById("newKgInput").value = "";

    showTransactions(modalDate, modalType);
    showReport();
}


function closeModal() {
    document.getElementById("transactionModal").style.display = "none";
}

function deleteTransaction(timeKey) {
    let allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    // Remove matching entry
    allSales = allSales.filter(entry => entry.time !== timeKey);

    localStorage.setItem("salesLog", JSON.stringify(allSales));

    // Refresh modal & table
    closeModal();
    showReport();
}
