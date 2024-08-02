const input = document.querySelector(".input");
const btn = document.querySelector(".submit");
const task = document.querySelector(".task");

// Function to save tasks to local storage
const saveTasksToLocalStorage = () => {
    const tasks = [];
    document.querySelectorAll('.task-list').forEach(taskElem => {
        const taskText = taskElem.querySelector('.task-span').textContent;
        const importance = taskElem.querySelector('.imp').value;
        tasks.push({ text: taskText, importance: importance });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Function to load tasks from local storage
const loadTasksFromLocalStorage = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskData => {
        addTaskToDOM(taskData.text, taskData.importance);
    });
};

// Function to add a task to the DOM
const addTaskToDOM = (taskText, importance) => {
    const taskElem = document.createElement('div');
    taskElem.classList.add('task-list');
    taskElem.innerHTML = `
        <div class="task-span">
            <span class="task-span">${taskText}</span>
        </div>
        <div class="options">
            <select name="Important" class="imp">
                <option ${importance === 'Important' ? 'selected' : ''}>Important</option>
                <option ${importance === 'Not Important' ? 'selected' : ''}>Not Important</option>
            </select>
        </div>
        <div class="task-actions">
            <button class="edit-btn btn wiggle-button">
                <span class="material-symbols-outlined edit">edit</span>
            </button>
            <button class="delete-btn btn wiggle-button">
                <span class="material-symbols-outlined remove">delete</span>
            </button>
        </div>
    `;

    task.appendChild(taskElem);

    // Add event listeners for the edit and delete buttons
    const editBtn = taskElem.querySelector('.edit-btn');
    const deleteBtn = taskElem.querySelector('.delete-btn');

    editBtn.addEventListener('click', () => editTask(taskElem));
    deleteBtn.addEventListener('click', () => {
        deleteTask(taskElem);
        saveTasksToLocalStorage(); // Save tasks after deletion
    });
};

// Function to add a new task
const addTask = () => {
    const newTask = input.value;

    if (newTask.length === 0) {
        return;
    }

    // Create a default importance level (can be adjusted as needed)
    const defaultImportance = 'Not Important';

    addTaskToDOM(newTask, defaultImportance);

    // Clear the input field
    input.value = "";

    // Save tasks to local storage
    saveTasksToLocalStorage();
};

// Function to edit a task
const editTask = (taskElem) => {
    const taskSpan = taskElem.querySelector('.task-span');
    const newTask = prompt('Edit your task:', taskSpan.textContent);
    if (newTask !== null && newTask.length > 0) {
        taskSpan.textContent = newTask;
        saveTasksToLocalStorage(); // Save tasks after editing
    }
};

// Function to delete a task
const deleteTask = (taskElem) => {
    taskElem.remove();
    saveTasksToLocalStorage(); // Save tasks after deletion
};

// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

btn.addEventListener("click", addTask);
