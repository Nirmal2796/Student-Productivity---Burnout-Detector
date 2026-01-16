const task = document.getElementById('taskInput');

const task_div = document.getElementById('task-div');
const tbody = document.getElementById('tableBody');

const taskForm = document.getElementById('taskForm');

taskForm.addEventListener('submit', onSubmit);

document.addEventListener('DOMContentLoaded', DOMLoad);


function DOMLoad() {
    try {
        getTasks();
    } catch (error) {

    }
}


async function onSubmit(e) {

    e.preventDefault();

    try {

        const token = localStorage.getItem('token');

        const result = await axios.post("http://localhost:3000/addTask", { task: task.value }, { headers: { 'Auth': token } });

        console.log(result);

        showTasks(result.data.task);

        taskForm.reset();


    } catch (error) {
        console.log(error);
    }

}


async function getTasks() {

    try {

        const token = localStorage.getItem('token');

        const result = await axios.get("http://localhost:3000/getTask", { headers: { 'Auth': token } });

        console.log(result);

        const tasks = result.data.tasks;

        for (let task in tasks) {
            showTasks(tasks[task]);
        }

    } catch (error) {
        console.log(error);
    }

}

function showTasks(task) {

    const row = document.createElement('tr');
    row.id=task._id;


    // task.status=true;
    row.innerHTML =`<td><input type="checkbox" name="status" id="status" ${task.status ? `checked`:''}></td>`

    row.innerHTML += `<td ${task.status ? `class = "completed"`:''}>${task.taskName}</td>
            <td><button id="delete" onclick="deleteTask('${task._id}')">Delete</button></td>`;

    // add on top
    tbody.prepend(row);

}

async function deleteTask(id){
    try {
        const token=localStorage.getItem('token');

        const data = await axios.delete(`http://localhost:3000/deleteTask/${id}`, { headers: { 'Auth': token } });
        document.getElementById(id).remove();
    } catch (error) {
        console.log(error);
    }
}