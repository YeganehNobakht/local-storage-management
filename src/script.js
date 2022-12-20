const form = document.getElementById("my-task-form");
const taskCards = document.getElementById("task-cards")
const doingCards = document.getElementById("doing-cards")
const doneCards = document.getElementById("done-cards")
const alltasksArray = [];


form.onsubmit = (e) => {
    e.preventDefault();
    addNewTask(e)
}

function addNewTask(e) {
    const task = gatherFormData(e)
    const newTask = { ...task, id: generateId, status: "new" }
    createAcard(newTask, taskCards)
    //   update local storage
    addUpdatedTasksArrayToLocalStorage(alltasksArray.push(newTask))

}
function generateId() {
    if (localStorage.getItem("id")) {
        localStorage.setItem("id", 1)
        return 1;
    } else {
        localStorage.setItem("id") + 1
        return localStorage.getItem("id")
    }
}

function gatherFormData(e) {
    const { title, date } = e.target
    return {
        date: date.value,
        title: title.value,
        start: new Date().toLocaleDateString("en-US")
    }
}
function createAcard(task, locationToAdd) {
    const card = `
    <div class="card">
    <h5 class="card-heading">task${task.title}</h5>
    <p class="start">start${task.start}:</p>
    <p class="end">end:${task.date}</p>
    <button type="button" id="revert">➖</button>
    <button type="button" id="do">✔</button>
  </div>`
    locationToAdd.insertAdjacentHTML("beforeend", card)
}
function addUpdatedTasksArrayToLocalStorage(alltasksArray) {
    localStorage.setItem("tasks", alltasksArray)
}