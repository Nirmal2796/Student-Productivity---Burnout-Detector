const tbody = document.getElementById('days-table-body');




document.addEventListener('DOMContentLoaded', DOMLoad);


function DOMLoad() {
    try {
        getStatus();
        getTaskSummary();
    } catch (error) {

    }
}

async function getStatus(e) {

    try {
        const token = localStorage.getItem('token');

        const result = await axios.get("http://localhost:3000/getDailyStatus", { headers: { 'Auth': token } });

        console.log(result.data);
        const rows = result.data.status.slice(0, 3);

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

async function getTaskSummary() {
    try {
        const token = localStorage.getItem('token');

        const result = await axios.get("http://localhost:3000/getTaskSummary", { headers: { 'Auth': token } });

        console.log(result.data);


        document.getElementById('totalTasks').textContent = result.data.totalTasks;
        document.getElementById('completedTasks').textContent = result.data.completed;
        document.getElementById('missedTasks').textContent = result.data.notcompleted;
        document.getElementById('completionRate').textContent = result.data.completionRate + "%";


    } catch (error) {
        console.log(error);
    }
}