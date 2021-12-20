let tasks = [];
let copiedTasks = [];
let copiedTasksFilter = [];
let removedTask = [];
let orderAdded = [];
function saveLiveText() {
    localStorage.setItem('text', document.getElementById('textInput').value);
}
function saveLiveDate() {
    localStorage.setItem('date', document.getElementById('dateInput').value);
}
function loadLiveData() {
    let text = localStorage.getItem('text');
    let date = localStorage.getItem('date');
    document.getElementById('textInput').value = text;
    document.getElementById('dateInput').value = date;
}
function createTask(event) {
    // TODO: Pull in form data from DOM
    // TODO: Format it to JSON
    // TODO: Save it to local storage
    localStorage.setItem('text', '');
    localStorage.setItem('date', '');
    event.preventDefault();
    let formData = new FormData(event.currentTarget);
    let str = Object.fromEntries(formData);
    let safeText = checkInput(str.text);
    str.text = safeText;
    str.id = Date.now();
    str.done = false;
    let newTask = new Task(str);
    tasks.push(newTask)
    updateStorage(tasks);
    document.getElementById('textInput').value = '';
    document.getElementById('dateInput').value = '';
}
function readStorage() {
    // ... read from the local storage
    let retrieveArray = localStorage.getItem('database');
    let result = JSON.parse(retrieveArray) || [];
    result = result.map(taskData => new Task(taskData));
    tasks = result;
    copiedTasks = tasks;
    readTasks(result);
}
function updateStorage(newData) {
    // ... update the local storage
    localStorage.setItem('database', JSON.stringify(newData));
    readStorage();
}
function readTasks(createdTasks) {
    // TODO: Pull in tasks from local storage
    // TODO: Parse tasks using the toHTML() function
    // TODO: Update DOM accordingly
    let ul = document.getElementById("taskls");
    ul.innerHTML = "";
    for (let i = 0; i < createdTasks.length; i++) {
        ul.innerHTML += createdTasks[i].toHTML();
    }
}
function checkInput(text) {
    // Check for these characters -> &#%'"`/<>
    text = text.replaceAll('&', '&#38;').replaceAll('#', '&#35;').replaceAll('%', '&#37;').replaceAll('\'', '&#39;').replaceAll('"', '&#34;').replaceAll('/', '&#47;').replaceAll('`', '&#96;').replaceAll('<', '&#60;').replaceAll('>', '&#62;');
    return text;
}
function updateTask(id) {
    // TODO: Update the task in `tasks` array by flipping it's `done` value
    // TODO: Save to local storage
    // TODO: Make the DOM update
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].toggle();
            updateStorage(tasks);
        }
    }
}
function deleteTask(id) {
    // TODO: Delete task from `tasks` array
    // TODO: Save to local storage
    // TODO: Make the DOM update
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks.splice(i, 1);
            updateStorage(tasks);
        }
    }
}
function sortTasks() {
    let switchStatusDate = document.getElementById("sort by date").checked;
    let switchStatusCompleted = document.getElementById("filter completed tasks").checked;
    if (switchStatusDate) {
        readTasks(copiedTasks.sort(function(a,b){return new Date(a.date) - new Date(b.date)}));
    }
    else if (!switchStatusDate) {
        readStorage();
    }
    if (switchStatusCompleted) {
        readTasks(copiedTasks.filter(returnFalse));
    }
}
function returnFalse(task) {
    if (!task.done) {
        return task;
    }
}
class Task {
    constructor({ text, date, done, id }) {
        // HINT This method is the constructor. In C++, this would be
        // the Task() method. The curly braces inside the constructor is // a JavaScript syntax that is called 'deconstruction'. This
        // means the constructor will ask for an object
        // (`{i: 'am', an: 'object'}`) with the parameters `text`,
        // `date`, `done`, and `id`. This will make it easier to
        // convert it from the local storage database we will set up.
        this.text = text,
        this.date = date,
        this.done = done,
        this.id = id
    }
    toHTML() {
        // TODO: Fill out this method. It should return a string version
        // of this task, including an `<li>` tag and all of the
        // css classes you used to make it look pretty. It should
        // display the `text`, `date`, and `done` property of this
        // Task. It should also have two listeners, which call the
        // update and delete function, with this Task's `id` as a
        // parameter.
        return `
        <li class="task">
            <input type="checkbox" id="${this.id}" onclick="updateTask(${this.id})" class="task-done checkbox-icon" ${this.done? " checked" :""}>
            <span class="task-description borders ${this.done? " line-through" : ""}">${this.text}</span>
            <span class="task-date">${this.prettyDate()}</span>
            <button type="button" class="task-delete material-icon" onclick="deleteTask(${this.id})">remove</button>
        </li>
        `
    }
    prettyDate() {
        // TODO: Fill out this method. It should return the date in our
        // locale's format, 'MM / DD / YYYY', instead of the
        // easily-sortable international standard, 'YYYY-MM-DD'.
        let d = this.date;
        let array = d.split('-');
        let year = array[0];
        let month = array[1];
        let day = array[2];
        return `${month}/${day}/${year}`
    }
    toggle() {
        // TODO: Fill out this method. It should flip this Task's `done`
        // property from `true` to `false`, or from `false` to `true`.
        if (this.done) {
            this.done = false;
        }
        else {
            this.done = true;
        }
    }
}
