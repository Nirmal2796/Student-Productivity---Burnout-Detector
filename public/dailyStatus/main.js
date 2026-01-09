const studyHours = document.getElementById('studyHours');
const sleepHours = document.getElementById('sleepHours');
const energy = document.getElementById('energy');
const mood = document.getElementById('mood');
const tbody = document.getElementById('tableBody');

const dailyStatusForm = document.getElementById('dailyStatus');


document.addEventListener('DOMContentLoaded', DOMLoad);
addEventListener('submit', onSubmit);



function DOMLoad() {
    try {
        getStatus();
    } catch (error) {

    }
}



async function onSubmit(e) {

    e.preventDefault();

    try {
        const token = localStorage.getItem('token');

        const dailyStatus = {
            studyHours: studyHours.value,
            sleepHours: sleepHours.value,
            energy: energy.value,
            mood: mood.value
        };

        const result = await axios.post("http://localhost:3000/addDailyStatus", dailyStatus, { headers: { 'Auth': token } });

        console.log(result.data.dailyStatus);

        addNewRow(result.data.dailyStatus);

        dailyStatusForm.reset();

    } catch (error) {
        console.log(error);
        dailyStatusForm.reset();
        alert(error.response.data.error);
        
    }
}

async function getStatus(e) {

    try {
        const token = localStorage.getItem('token');

        const result = await axios.get("http://localhost:3000/getDailyStatus", { headers: { 'Auth': token } });

        console.log(result.data);
        showStatus(result.data.staus);


    } catch (error) {
        console.log(error);
    }
}

function showStatus(rows) {
    for (let r of rows) {
        addNewRow(r);
    }
}


function addNewRow(r) {

    removeLastRow();

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

function removeLastRow() {
    if (tbody.rows.length > 6) {
        tbody.deleteRow(tbody.rows.length - 1);
    }
}