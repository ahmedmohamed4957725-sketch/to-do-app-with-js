

//-----------------Global Variables-----------------
let addTaskForm = document.getElementById("addTaskForm");
let taskTitle = document.getElementById("task_title");
let taskDesc = document.getElementById("task_description");
let taskDueDate = document.getElementById("taskDueDate");
let sumbit_butt = document.getElementById("submit_button");
let taskListContainer = document.getElementById("task_list_ul");
let searchInput = document.getElementById("search_input");
let filterBtn = document.querySelectorAll(".filter__Btn");
let taskCountAll = document.getElementById("task_count_all");
let taskCountPending = document.getElementById("task_count_pending");
let taskCountCompleted = document.getElementById("task_count_completed");
let error_message = document.getElementById("error_message");



//--------------Main Data Source-----------------
const StorageTaskList = () => {
    localStorage.setItem("TaskList", JSON.stringify(TaskList));
}


let TaskList = JSON.parse(
    localStorage.getItem("TaskList") || []);

//console.log(TaskList);


//console.log(taskname, taskdet, taskDueDate, sumbit_butt);



//---------------------Validate Task-----------------
let messageTimer;

const showMessage = (message, type = "error") => {
    clearTimeout(messageTimer);

    error_message.textContent = message;

    error_message.classList.remove("error-message", "success-message");
    error_message.classList.add("show", `${type}-message`);

    messageTimer = setTimeout(() => {
        error_message.textContent = "";
        error_message.classList.remove("show");
    }, 5000);
};

const validateTask = (title, dueDate, currentTask = null) => {
    title = taskTitle.value.trim();
    dueDate = taskDueDate.value.trim();

    if (!title && !dueDate) {
        showMessage("Please enter task title and due date");
        return false;
    }

    if (!title) {
        showMessage("Please enter task title");

        if (currentTask) {
            document.getElementById("task_title__edit").focus();
        } else {
            taskTitle.focus();
        }

        return false;
    }

    if (!dueDate) {
        showMessage("Please enter task due date");
        console.log(dueDate);

        if (currentTask) {
            document.getElementById("taskDueDate__edit").focus();
        } else {
            taskDueDate.focus();
        }

        return false;
    }

    const duplicateTask = TaskList.some(task =>
        task.title.trim().toLowerCase() === title.toLowerCase() &&
        task.id !== currentTask?.id
    );

    if (duplicateTask) {
        showMessage("Task title already exists");
        return false;
    }

    const selectedDate = new Date(dueDate);
    const now = new Date();

    if (
        Number.isNaN(selectedDate.getTime()) ||
        selectedDate < now
    ) {
        showMessage("Due date cannot be before current date");
        return false;
    }

    return true;
};
//------------submit Task-----------------

const handleSubmit = () => {
    sumbit_butt.addEventListener("click", (e) => {
        e.preventDefault();
        if (!validateTask()) {
            return;
        }
        handleAddTask(taskTitle.value.trim(), taskDesc.value.trim(), taskDueDate.value);
        //console.log(taskTitle.value, taskDesc.value, taskDueDate.value);
    })
}
handleSubmit();
//----------------------Store data-----------------
const handleAddTask = (title, description, dueDate) => {
    let task = new TaskDetails(title, description, dueDate);
    TaskList.push(task);
    taskTitle.value = "";
    taskDesc.value = "";
    taskDueDate.value = "";
    console.log(TaskList);
    StorageTaskList();
    showMessage("Task added successfully", "success");
   updateTaskList();
}

//----------------------Return Task-----------------
const returnTask = (TaskList) => {
    //console.log(TaskList);
    taskListContainer.innerHTML = "";

    TaskList.forEach(task => {
        returnUI(task);

    })
    updateTaskCount();
    //localStorage.setItem("TaskList", JSON.stringify(TaskList));
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
    <button class="task__item__com__btn" aria-label="Complete tasks status">Complete</button>
    <button class="task__item__del__btn" aria-label="Delete tasks status">Delete</button>
    <button class="task__item__edit__btn" aria-label="Edit tasks status">Edit</button>`
        taskitem.classList.add('task__item');
        taskListContainer.appendChild(taskitem);
        completeTask(task, taskitem);
        deleteTask(task, taskitem);
        editTask(task, taskitem);
}

//--------------------Complete Task-----------------
const completeTask = (task, taskitem) => {
    const completeBtn = taskitem.querySelector(".task__item__com__btn");
    if (task.status === "completed") {
        taskitem.classList.add("completed");
    }
    completeBtn.textContent =
        task.status === "completed" ? "Pending" : "Complete";

    completeBtn.addEventListener("click", () => {
        handleCompleteTask(task);
    });
};

const handleCompleteTask = (task) => {
    if (task.status === "pending") {
        task.status = "completed";
    } else {
        task.status = "pending";
    }
    StorageTaskList();
    updateTaskList();

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
    StorageTaskList();
    updateTaskList();
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

    // Prevent duplicate edit forms for this task only
    if (taskitem.querySelector(".edit__form")) {
        return;
    }

    const editTaskForm = document.createElement("form");

    editTaskForm.classList.add("edit__form");

    editTaskForm.innerHTML = `
        <input
            type="text"
            class="task_title__edit"
            value="${task.title}"
            placeholder="Title"
        >

        <input
            type="text"
            class="task_description__edit"
            value="${task.description ?? ""}"
            placeholder="Description"
        >

        <input
            type="datetime-local"
            class="taskDueDate__edit"
            value="${task.dueDate}"
        >

        <p class="edit__error"></p>

        <button type="submit">Save Changes</button>
        <button type="button" class="cancel__edit__btn">Cancel</button>
    `;

    taskitem.appendChild(editTaskForm);

    const titleInput =
        editTaskForm.querySelector(".task_title__edit");

    const descriptionInput =
        editTaskForm.querySelector(".task_description__edit");

    const dueDateInput =
        editTaskForm.querySelector(".taskDueDate__edit");

    const editError =
        editTaskForm.querySelector(".edit__error");

    // Cancel only this task's edit form
    editTaskForm
        .querySelector(".cancel__edit__btn")
        .addEventListener("click", () => {
            editTaskForm.remove();
        });

    editTaskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const dueDate = dueDateInput.value;

        // Validate the actual edit inputs
        if (!title && !dueDate) {
            editError.textContent =
                "Please enter task title and due date";
            return;
        }

        if (!title) {
            editError.textContent = "Please enter task title";
            titleInput.focus();
            return;
        }

        if (!dueDate) {
            editError.textContent = "Please enter task due date";
            dueDateInput.focus();
            return;
        }

        // Ignore the current task when checking duplicate titles
        const duplicateTask = TaskList.some(item =>
            item.id !== task.id &&
            item.title.trim().toLowerCase() === title.toLowerCase()
        );

        if (duplicateTask) {
            editError.textContent = "Task title already exists";
            titleInput.focus();
            return;
        }

        const selectedDate = new Date(dueDate);

        if (
            Number.isNaN(selectedDate.getTime()) ||
            selectedDate < new Date()
        ) {
            editError.textContent =
                "Due date cannot be before current date";
            dueDateInput.focus();
            return;
        }

        handleEditTask(task, title, description, dueDate);
    });
};


//---------------- Apply Edit Task -----------------

const handleEditTask = (task, title, description, dueDate) => {
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;

    StorageTaskList();

    updateTaskList();

    showMessage("Task updated successfully", "success");
};

//--------------------Update Task Count-----------------

const updateTaskCount = () => {
    taskCountAll.textContent = TaskList.length;
    taskCountPending.textContent = TaskList.filter(task => task.status === "pending").length;
    taskCountCompleted.textContent = TaskList.filter(task => task.status === "completed").length;
}



//---------------------Search & Filter Task-----------------

let currentFilter = "all";

const updateTaskList = () => {
    const searchText = searchInput.value.toLowerCase().trim();
    const filteredTasks = TaskList.filter(task => {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchText);

        const matchesStatus =
            currentFilter === "all" ||
            task.status === currentFilter;

        return matchesSearch && matchesStatus;
    });

    returnTask(filteredTasks);
};

searchInput.addEventListener("input", updateTaskList);

//-------------------- Filter buttons-----------------
filterBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.value;
        updateTaskList();
    });
});


//---------------Render Task-----------------



updateTaskList();



//--------------------Task details-----------------
function TaskDetails (title, description, dueDate, status = "pending",id = Date.now()) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status;
    return this;
}




