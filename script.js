// script.js - task manager logic

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const errorMessage = document.getElementById('errorMessage');
const themeToggle = document.getElementById('themeToggle');
const filterAll = document.getElementById('filterAll');
const filterPending = document.getElementById('filterPending');
const filterCompleted = document.getElementById('filterCompleted');

// Load tasks from localStorage if available
const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';

// Load theme preference
const isDarkMode = localStorage.getItem('darkMode') === 'true';

document.addEventListener('DOMContentLoaded', () => {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
    tasks.forEach(renderTask);
    filterTasks();
});

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.dataset.completed = task.completed;

    const span = document.createElement('span');
    span.className = 'task-text';
    if (task.completed) span.classList.add('completed');
    span.textContent = task.text;
    span.tabIndex = 0;

    span.addEventListener('click', () => toggleComplete(task.id));
    span.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') toggleComplete(task.id);
    });

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.setAttribute('aria-label', '删除任务');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);
    taskList.appendChild(li);
}

function addTask(text) {
    const task = {
        id: Date.now().toString(),
        text,
        completed: false,
    };
    tasks.push(task);
    renderTask(task);
    saveTasks();
    filterTasks();
}

function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        const li = taskList.querySelector(`li[data-id="${id}"]`);
        if (li) li.remove();
        saveTasks();
        filterTasks();
    }
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        const span = taskList.querySelector(`li[data-id="${id}"] .task-text`);
        if (span) span.classList.toggle('completed');
        const li = taskList.querySelector(`li[data-id="${id}"]`);
        if (li) li.dataset.completed = task.completed;
        saveTasks();
        filterTasks();
    }
}

function filterTasks() {
    const lis = taskList.querySelectorAll('li');
    lis.forEach(li => {
        const completed = li.dataset.completed === 'true';
        let show = false;
        if (currentFilter === 'all') show = true;
        else if (currentFilter === 'completed' && completed) show = true;
        else if (currentFilter === 'pending' && !completed) show = true;
        li.style.display = show ? '' : 'none';
    });
}

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`).classList.add('active');
    filterTasks();
}

// form submission handler

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        addTask(text);
        taskInput.value = '';
        taskInput.classList.remove('error');
        errorMessage.textContent = '';
        taskInput.focus();
    } else {
        taskInput.classList.add('error');
        errorMessage.textContent = '任务内容不能为空，请输入有效内容。';
        taskInput.focus();
    }
});

// clear error on input
taskInput.addEventListener('input', () => {
    if (taskInput.classList.contains('error')) {
        taskInput.classList.remove('error');
        errorMessage.textContent = '';
    }
});

// filter button handlers
filterAll.addEventListener('click', () => setFilter('all'));
filterPending.addEventListener('click', () => setFilter('pending'));
filterCompleted.addEventListener('click', () => setFilter('completed'));

// theme toggle handler
themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
});
