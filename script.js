document.addEventListener('DOMContentLoaded', function () {
    fetch('data.csv')
        .then(response => response.text())
        .then(csvData => {
            const data = parseCSV(csvData);
            populateKPITable(data);
            populateSupplyMetricsTable(data);
            populateCustomerSatisfactionTable(data);
        });

    function parseCSV(csvText) {
        const lines = csvText.split('\\n');
        const headers = lines[0].split(',');
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(',');
            if (currentLine.length === headers.length) {
                const entry = {};
                for (let j = 0; j < headers.length; j++) {
                    entry[headers[j].trim()] = currentLine[j].trim();
                }
                data.push(entry);
            }
        }
        return data;
    }

    function populateKPITable(data) {
        const kpiTableBody = document.getElementById('kpi-table-body');
        const brands = [...new Set(data.map(item => item['Brand']))];

        const kpis = [
            "Total Revenue",
            "Gross Profit",
            "Net Profit",
            "Customer Acquisition Cost",
            "Conversion Rate"
        ];

        brands.forEach(brand => {
            kpis.forEach(kpiName => {
                const kpiData = data.find(item => item['Brand'] === brand && item['KPI Name'] === kpiName && item['Month of Date'] === 'January' && item['Year of Date'] === '2025');
                let kpiValue = kpiData ? kpiData['This Period Value'] : '';
                if (kpiValue && (kpiName === "Total Revenue" || kpiName === "Gross Profit" || kpiName === "Net Profit" || kpiName === "Customer Acquisition Cost")) {
                    kpiValue = '$' + parseFloat(kpiValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                } else if (kpiValue && kpiName === "Conversion Rate") {
                    kpiValue = parseFloat(kpiValue).toFixed(2) + '%';
                }


                if (kpiName === "Total Revenue") {
                    let row = kpiTableBody.insertRow();
                    let cellKPI = row.insertCell();
                    cellKPI.textContent = " ";
                    row = kpiTableBody.insertRow();
                    cellKPI = row.insertCell();
                    cellKPI.rowSpan = kpis.length;
                    cellKPI.textContent = "Key Performance Indicators (KPIs)";
                }


                let row = kpiTableBody.insertRow();
                let cellKPI = row.insertCell();
                cellKPI.textContent = kpiName;
                let cellBrand = row.insertCell();
                cellBrand.textContent = brand;
                let cellMTD = row.insertCell();
                cellMTD.textContent = kpiValue;
                let cellMvsB = row.insertCell();
                cellMvsB.textContent = ''; // Month vs Budget - empty
                let cellYTD = row.insertCell();
                cellYTD.textContent = kpiValue; // Year to Date - same as MTD for January
                let cellLY = row.insertCell();
                cellLY.textContent = ''; // Last Year - empty


            });
        });
    }

    function populateSupplyMetricsTable(data) {
        const supplyMetricsTableBody = document.getElementById('supply-metrics-table-body');
        const brands = [...new Set(data.map(item => item['Brand']))];
        const metrics = [
            "Inventory Turnover",
            "Inventory Value"
        ];

        brands.forEach(brand => {
            metrics.forEach(metricName => {
                let row = supplyMetricsTableBody.insertRow();
                let cellMetric = row.insertCell();
                cellMetric.textContent = metricName;
                let cellBrand = row.insertCell();
                cellBrand.textContent = brand;
                let cellCurrentValue = row.insertCell();
                cellCurrentValue.textContent = 'N/A'; // Data not available
                let cellMTDChange = row.insertCell();
                cellMTDChange.textContent = ''; // Month-to-Date Change - empty
                let cellYTDChange = row.insertCell();
                cellYTDChange.textContent = ''; // Year-to-Date Change - empty
            });
        });
    }

    function populateCustomerSatisfactionTable(data) {
        const customerSatisfactionTableBody = document.getElementById('customer-satisfaction-table-body');
        const brands = [...new Set(data.map(item => item['Brand']))];
        const metrics = [
            "Net Promoter Score (NPS)",
            "Customer Satisfaction Score",
            "Customer Retention Rate"
        ];

        brands.forEach(brand => {
            metrics.forEach(metricName => {
                let row = customerSatisfactionTableBody.insertRow();
                let cellMetric = row.insertCell();
                cellMetric.textContent = metricName;
                let cellBrand = row.insertCell();
                cellBrand.textContent = brand;
                let cellCurrentValue = row.insertCell();
                cellCurrentValue.textContent = 'N/A'; // Data not available
                let cellMTDChange = row.insertCell();
                cellMTDChange.textContent = ''; // Month-to-Date Change - empty
                let cellYTDChange = row.insertCell();
                cellYTDChange.textContent = ''; // Year-to-Date Change - empty
            });
        });
    }
});