// ----------------------------------Project Plan-------------------------------
/*
1. Project Description: 
    A simple to-do list application that allows users to add, delete, mark, edit, and view tasks.
2. Project Features:
    |-----A) Primary features
    |-1. Add a new task
    |-2. Delete a task
    |-3. Mark a task as completed
    |-4. Edit a task details
    |-5. View all tasks
    |------B) Secondary features
    |-1. Search tasks by name or status
    |-2. Filter tasks by status
    | 
    |
    |
3. Project Inputs:
    |-1. Task name // ui input
    |-2. Task status (pending/completed)// system input
    |-3. Task details (optional)// ui input
    |-4. Task Time & Date // ui input
4. Project Outputs:
    |-1. Task list // ui output
    |-2. Task details // ui output
    |-3. Task Delete button // ui output
    |-4. Task completed button // ui output
    |-5. Task edit button // ui output
    |-6. Completed tasks list // ui output
5. Project steps:
    |-1. User inputs task name, details, and Time & Date
    |-2. Task is added to the list
    |-3. User can delete, mark as completed, edit, and view all tasks
    |-4. Return UI to the main screen

*/


//-----------------Global Variables-----------------
let addTaskForm = document.getElementById("addTaskForm");
let taskTitle = document.getElementById("task_title");
let taskDesc = document.getElementById("task_description");
let taskDueDate = document.getElementById("taskDueDate");
let sumbit_butt = document.getElementById("submit_button");
let taskListContainer = document.getElementById("task_list_ul");



//--------------Main Data Source-----------------
let TaskList = [];

//console.log(taskname, taskdet, taskDueDate, sumbit_butt);

//------------submit Task-----------------

const handleSubmit = () => {
    sumbit_butt.addEventListener("click", (e) => {
        e.preventDefault();
        handleAddTask(taskTitle.value, taskDesc.value, taskDueDate.value);
        //console.log(taskTitle.value, taskDesc.value, taskDueDate.value);
    })
}
handleSubmit();
//----------------------Store data-----------------
const handleAddTask = (title, description, dueDate) => {
    let task = new TaskDetails(title, description, dueDate);
    TaskList.push(task);
    console.log(TaskList);
    returnTask(TaskList);
}

//----------------------Return Task-----------------
const returnTask = (TaskList) => {
    //console.log(TaskList);
    taskListContainer.innerHTML = "";

    TaskList.forEach(task => {
        //console.log(task);
        returnUI(task);

    })
}
//----------------------Display data-----------------
const returnUI = (task) => {
    //console.log(task);
        let taskitem = document.createElement("li");
        taskitem.innerHTML = `
    <span class="task__item__num">${taskListContainer.children.length + 1}</span>
    <h3 class="task__item__title">${task.title}</h3>
    <p class="task__item__desc">${task.description}</p>
    <p class="task__item__dueDate">Due Date: ${task.dueDate}</p>
    <p class="task__item__status">Status: ${task.status}</p>
    <button class="task__item__com__btn">Complete</button>
    <button class="task__item__del__btn">Delete</button>
    <button class="task__item__edit__btn">Edit</button>`
        taskitem.classList.add('task__item');
        taskListContainer.appendChild(taskitem);
        completeTask(task, taskitem);
        deleteTask(task, taskitem);
        editTask(task, taskitem);
}

//--------------------Complete Task-----------------
const completeTask = (task, taskitem) => {
    const completeBtn = taskitem.querySelector(".task__item__com__btn");

    completeBtn.addEventListener("click", () => {
        handleCompleteTask(task, taskitem, completeBtn);
    });
};

const handleCompleteTask = (task, taskitem, completeBtn) => {
    if (task.status === "pending") {
        task.completed();
    } else {
        task.status = "pending";
    }

    // Toggle the task background
    taskitem.classList.toggle(
        "completed",
        task.status === "completed"
    );

    // Update button text
    completeBtn.textContent =
        task.status === "completed" ? "Pending" : "Complete";

    // Update status text
    taskitem.querySelector(".task__item__status").textContent =
        `Status: ${task.status}`;

    console.log(TaskList);
};
//---------------------Delete Task-----------------



const deleteTask = (task, taskitem) => {
    const deleteBtn = taskitem.querySelector(".task__item__del__btn");
    deleteBtn.addEventListener("click", () => {
        handleDeleteTask(task);
    });
};

const handleDeleteTask = (task) => {
    TaskList = TaskList.filter(item => item.id !== task.id);
    returnTask(TaskList);
    //console.log(TaskList);
};


//-------------------Edit Task-----------------
const editTask = (task, taskitem) => {
    const editBtn = taskitem.querySelector(".task__item__edit__btn");
    editBtn.addEventListener("click", () => {
        EditTaskForm(task, taskitem);
    });
};

//--------------------Edit Task Form-----------------
const EditTaskForm = (task, taskitem) => {
    //console.log(task);
    let editTaskForm = document.createElement("form");
    editTaskForm.innerHTML = `
    <input type="text" id="task_title__edit" value="${task.title}" placeholder="Title">
    <input type="text" id="task_description__edit" value="${task.description}" placeholder="Description">
    <input type="datetime-local" id="taskDueDate__edit" value="${task.dueDate}">
    <button id="submit__butt">Submit</button>
    `;
    editTaskForm.classList.add("edit__form");
    taskitem.appendChild(editTaskForm);
    editTaskForm.addEventListener("submit", (e) => {
        console.log("task");
        e.preventDefault();
        handleEditTask(task);
    });
}

//---------------- Edit Data-----------------
const handleEditTask = (task) => {
    task.title = document.getElementById("task_title__edit").value;
    task.description = document.getElementById("task_description__edit").value;
    task.dueDate = document.getElementById("taskDueDate__edit").value;
    returnTask(TaskList,
        task.description,
        task.dueDate);
    console.log(TaskList);
}

//--------------------Task details-----------------
function TaskDetails (title, description, dueDate, status = "pending",id = Date.now()) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status;
        this.completed = () => {
            this.status = "completed";
        }
    return this;
}




