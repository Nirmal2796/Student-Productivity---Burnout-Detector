const studyHours = document.getElementById('studyHours');
const sleepHours = document.getElementById('sleepHours');
const energy = document.getElementById('energy');
const mood = document.getElementById('mood');

const dailyStatusForm = document.getElementById('dailyStatus');


document.addEventListener('DOMContentLoaded', DOMLoad);
addEventListener('submit', onSubmit);



function DOMLoad(){
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

        console.log(result.data);

    } catch (error) {
        console.log(error);
    }
}

async function getStatus(e) {

    try {
        const token = localStorage.getItem('token');

        const result = await axios.get("http://localhost:3000/getDailyStatus", { headers: { 'Auth': token } });

        console.log(result.data);

    } catch (error) {
        console.log(error);
    }
}

function showStatus(){
    
}