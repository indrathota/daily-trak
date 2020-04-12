var ExcelToJSON = function () {

    this.parseExcel = function (file, week) {
        var reader = new FileReader();
        console.log(week);
        reader.onload = function (e) {
            var res = e.target.result;
            var workbook = XLSX.read(res, {
                type: 'binary'
            });
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets['Week-' + week]);
            let data = [];
            XL_row_object.forEach(row => {
                let active = 0, inactive = 0, error = 0;
                for (let key in row) {
                    if (row[key] === 'Active') {
                        active++;
                    }
                    if (row[key] === 'Inactive') {
                        inactive++;
                    } if (row[key] === 'Error') {
                        error++;
                    }
                }
                row['Active'] = active;
                row['Inactive'] = inactive;
                row['Error'] = error;
                data.push(row);
            });
            let groupedData = _.groupBy(data, 'Environment');
            createHTMLTable(groupedData);
            // addData(chart, labels, data);
        };

        reader.onerror = function (ex) {
            console.log(ex);
        };

        reader.readAsBinaryString(file);
    };
};

function createHTMLTable(data) {
    let tableContainer = document.getElementById('table');
    let wrapper = document.createElement('div');
    wrapper.classList.add('table-responsive-sm');
    let table = document.createElement('table');
    table.classList.add('table', 'table-hover');
    table.innerHTML = `
        <thead>
            <tr>
                <th scope="col">Environment</th>
                <th scope="col">API</th>
                <th scope="col">API Endpoint</th>
                <th scope="col">Active</th>
                <th scope="col">Inactive</th>
                <th scope="col">Error</th>
            </tr>
        <thead>
    `;
    wrapper.appendChild(table);
    tableContainer.appendChild(wrapper);
    let tbody = document.createElement('tbody');
    for (let key in data) {
        let tr = document.createElement('tr');
        tr.classList.add('table-active');
        tr.innerHTML = `<td colspan='6'>${key}</td>`;
        tbody.appendChild(tr);
        if (Array.isArray(data[key])) {
            for (let obj of data[key]) {
                let trt = document.createElement('tr');
                trt.innerHTML = `
                    <td>${obj.Environment}</td>
                    <td>${obj.API}</td>
                    <td>${obj.API_ENDPOINT}</td>
                    <td>${obj.Active}</td>
                    <td>${obj.Inactive}</td>
                    <td>${obj.Error}</td>
                `;
                tbody.appendChild(trt);
            }
        }
    }
    table.appendChild(tbody);
}

function addData(chart, label, data) {
    chart.data.labels = label;
    chart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    chart.update();
}

var customFile = document.getElementById('customFile');
var weekSelected = document.getElementById('week');
customFile.addEventListener('change', (evt) => {
    console.log(evt);
    var files = evt.target.files;
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0], weekSelected.value);
});
// var ctx = document.getElementById('myChart').getContext('2d');
// var chart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//         datasets: [{
//             label: 'Marks',
//             backgroundColor: 'rgb(255, 99, 132)',
//             borderColor: 'rgb(255, 99, 132)',
//             data: [0, 10, 5, 2, 20, 30, 45]
//         }]
//     },
//     options: {}
// });