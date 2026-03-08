const tbody = document.getElementById('days-table-body');

const days_table=document.getElementById('days-table');



document.addEventListener('DOMContentLoaded', DOMLoad);


async function DOMLoad() {
    try {
        await getDashboardSummary();
        await getStatus();
        await getTaskSummary();
    } catch (error) {

    }
}

async function getStatus(e) {

    try {
        const token = localStorage.getItem('token');

        const result = await axios.get("http://localhost:3000/getDailyStatus", { headers: { 'Auth': token } });

        console.log(result.data);

        if (result.data.status.length == 0) {
            days_table.hidden=true;
            document.getElementById('days-message-div').hidden=false;
        }
        else{

            if(days_table.hidden=true){
                days_table.hidden=false;
                document.getElementById('days-message-div').hidden=true;
            }

            const rows = result.data.status.slice(3, 7);

            // console.log(rows);
    
            for (let r of rows) {
                addNewRow(r);
            }

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
    else if (r.status == 'Healthy') {
        status = `<td class="status healthy ">Healthy</td>`;
    }
    else{
        status = `<td>${r.status}</td>`;
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

async function getDashboardSummary() {
    try {
        const token = localStorage.getItem('token');

        const result = await axios.get("http://localhost:3000/getDashboardSummary", { headers: { 'Auth': token } });

        // console.log(result.data);

        const response=result.data;

        const status=document.getElementById("status");

        if(response.status=='Burnout'){
            status.classList.add('status','burnout');
        }
        else if(response.status=='Healthy'){
            status.classList.add('..status.healthy')
        }
        else{
            status.classList.add('.status.at-risk')
        }

        // console.log(response);
        status.textContent = response.status;
        document.getElementById("reason").textContent = response.reason;
        document.getElementById("suggestion").textContent = response.suggestion;

    } catch (error) {
        console.log(error);
    }
}