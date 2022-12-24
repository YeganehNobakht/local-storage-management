const form = document.getElementById("my-task-form");
const taskCards = document.getElementById("task-cards");
const doingCards = document.getElementById("doing-cards");
const doneCards = document.getElementById("done-cards");
const revertButton = document.getElementById("revert");
const doneButton = document.getElementById("done");
const infoButton = document.getElementById("do");
let tooltipElem;
let alltasksArray;
let localstrg = JSON.parse(localStorage.getItem("jobArray"));
if (localstrg) {
    alltasksArray = localstrg;
} else {
    alltasksArray = []
}

if (localStorage.getItem("jobArray")) {
    addToTaskCardsFromLocalStorage();
    addToDoingCardsFromLocalStorage();
    addToDoneCardsFromLocalStorage();
}
form.onsubmit = (e) => {
    e.preventDefault();
    addNewTask(e)
}
// infoButton.addEventListener("click", (e) => {
//     const id = e.target.closest('.card').id
//     const taskArray = findTaskById(id)
//     .
// })

doneCards.addEventListener("click", (e) => manageTaskWithDoAdnRevertButton(e))

doingCards.addEventListener("click", (e) => manageTaskWithDoAdnRevertButton(e))

taskCards.addEventListener("click", (e) => { manageTaskWithDoAdnRevertButton(e) })

function manageTaskWithDoAdnRevertButton(e) {
    const target = e.target.closest("button")
    if (target) {
        const id = target.closest('.card').id
        const task = findTaskById(id)
        if (target.id == "revert") {
            setTaskStatusForRevertButton(task);
        } else if (target.id == "do") {
            setTaskStatusForDoingButton(task);
        }

        addToTaskCardsFromLocalStorage();
        addToDoingCardsFromLocalStorage();
        addToDoneCardsFromLocalStorage();
    }
}

function findTaskById(id) {
    return alltasksArray.filter(task => task.id == id)[0]
}

function setTaskStatusForRevertButton(task) {
    if (task.status == "new") {
        deleteFromLocalStorage(task)
    } else if (task.status == "doing") {
        task.status = "new";
        addUpdatedTasksArrayToLocalStorage(alltasksArray)
    } else if (task.status == "done") {
        task.status = "doing";
        addUpdatedTasksArrayToLocalStorage(alltasksArray)
    }
}

function setTaskStatusForDoingButton(task) {
    if (task.status == "new") {
        task.status = "doing"
        addUpdatedTasksArrayToLocalStorage(alltasksArray)
    } else if (task.status == "doing") {
        task.status = "done"
        addUpdatedTasksArrayToLocalStorage(alltasksArray)
    } else if (task.status == "done") {
        deleteFromLocalStorage(task)
    }
}

function deleteFromLocalStorage(task) {
    alltasksArray.splice(alltasksArray.indexOf(task), 1)
    addUpdatedTasksArrayToLocalStorage(alltasksArray)
}

function addNewTask(e) {
    const task = gatherFormData(e)
    const newTask = { ...task, id: generateId(), status: "new" }
    console.log("newTask", newTask);
    createAcard(newTask, taskCards)
    //   update local storage
    alltasksArray.push(newTask);
    addUpdatedTasksArrayToLocalStorage(alltasksArray)

}
function generateId() {
    let id = JSON.parse(localStorage.getItem("id"))
    console.log("id", id);
    if (!id) {
        console.log('set one');
        localStorage.setItem("id", 1)
        return 1;
    } else {
        localStorage.setItem("id", ++id)
        return localStorage.getItem("id")
    }
}

function gatherFormData(e) {
    const { title, description, date } = e.target
    return {
        date: date.value,
        title: title.value,
        description: description.value,
        start: new Date().toLocaleDateString("en-US").replaceAll("/", "-")
    }
}
function createAcard(task, locationToAdd) {
    const card = `
        <div class="card" id="${task.id}">
            <h5 class="card-heading">task${task.title}</h5>
            <p class="start">start: ${task.start}</p>
            <p class="end">end: ${task.date}</p>
            <div class="button-wrapper">
                <button type="button" id="revert"><i class="fa fa-close "></i></button>
                <button type="button" class="info" id="info"><i class="fa fa-info-circle"></i></button>
                <button type="button" id="do"><i class="fa fa-check"></i></button>
            </div>
        </div>`
    locationToAdd.insertAdjacentHTML("beforeend", card)

}
function addUpdatedTasksArrayToLocalStorage(alltasksArray) {
    localStorage.setItem("jobArray", JSON.stringify(alltasksArray))
}
function addToTaskCardsFromLocalStorage() {
    const localstrg = JSON.parse(localStorage.getItem("jobArray"))
    console.log(localstrg.length);
    if (localstrg.length != 0) {
        taskCards.innerHTML = "";
        localstrg.filter(task => task.status == "new").forEach(task => createAcard(task, taskCards))
    } else {
        taskCards.innerHTML = "";
    }
}

function addToDoingCardsFromLocalStorage() {
    const localstrg = JSON.parse(localStorage.getItem("jobArray"))
    if (localstrg.length != 0) {
        doingCards.innerHTML = ""
        localstrg.filter(task => task.status == "doing").forEach(task => createAcard(task, doingCards))
    }
    else
        doingCards.innerHTML = ""
}

function addToDoneCardsFromLocalStorage() {
    const localstrg = JSON.parse(localStorage.getItem("jobArray"))
    if (localstrg.length != 0) {
        doneCards.innerHTML = ""
        localstrg.filter(task => task.status == "done").forEach(task => createAcard(task, doneCards))
    }
    else
        doneCards.innerHTML = ""
}


// tooltip for showing task description
document.onmouseover = function (event) {
    let target = event.target;
    if (target.classList.contains('info')) {
        let taskId = target.closest(".card").id;
        let task = findTaskById(taskId)
        let tooltipHtml = task.description;
        if (!tooltipHtml) return;

        // ...create the tooltip element

        tooltipElem = document.createElement('div');
        tooltipElem.className = 'tooltip';
        tooltipElem.innerHTML = tooltipHtml;
        document.body.append(tooltipElem);

        // position it above the annotated element (top-center)
        let coords = target.getBoundingClientRect();

        let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2;
        if (left < 0) left = 0; // don't cross the left window edge

        let top = coords.top - tooltipElem.offsetHeight - 5;
        if (top < 0) { // if crossing the top window edge, show below instead
            top = coords.top + target.offsetHeight + 5;
        }

        tooltipElem.style.left = left + 'px';
        tooltipElem.style.top = top + 'px';
    };

    document.onmouseout = function (e) {

        if (tooltipElem) {
            tooltipElem.remove();
            tooltipElem = null;
        }
    }
};

