const tbody = document.getElementById('days-table-body');




document.addEventListener('DOMContentLoaded', DOMLoad);


function DOMLoad() {
    try {
        getStatus();
    } catch (error) {

    }
}

async function getStatus(e) {

    try {
        const token = localStorage.getItem('token');

        const result = await axios.get("http://localhost:3000/getDailyStatus", { headers: { 'Auth': token } });

        console.log(result.data);
        const rows = result.data.status.slice(0,3);

        for (let r of rows) {
            addNewRow(r);
        }


    } catch (error) {
        console.log(error);
    }
}


function addNewRow(r) {
    let status = '';
    if (r.status == 'At Risk') {
        status = `<td class="status at-risk">At Risk</td>`;
    }
    else if (r.status == 'Burnout') {
        status = `<td class="status burnout">Burnout</td>`;
    }
    else {
        status = `<td class="status healthy ">Healthy</td>`;
    }


    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${r.date.split('T')[0]}</td>
            <td>${r.studyHours}</td>
            <td>${r.sleepHours}</td>
            <td>${r.energy}</td>
            <td>${r.mood}</td>
            ${status}`;

    // add on top
    tbody.prepend(row);
}