const filterAllBtn = document.getElementById('filter-all');
const filterPendingBtn = document.getElementById('filter-pending');
const filterCompletedBtn = document.getElementById('filter-completed');
const themeToggle = document.getElementById('theme-toggle');

let filter = 'all'; // all | completed | pending

// Accessible Task Manager logic
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

function renderTasks(tasks) {
  taskList.innerHTML = '';
  let filteredTasks = tasks;
  if (filter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  } else if (filter === 'pending') {
    filteredTasks = tasks.filter(t => !t.completed);
  }
  filteredTasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.setAttribute('role', 'listitem');
    li.setAttribute('aria-label', task.text);

    const span = document.createElement('span');
    span.textContent = task.text;
    span.tabIndex = 0;
    span.setAttribute('aria-label', task.text);

    const controls = document.createElement('div');
    controls.className = 'task-controls';

    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? '未完成' : '完成';
    completeBtn.setAttribute('aria-label', task.completed ? '标记为未完成' : '标记为完成');
    completeBtn.onclick = () => {
      tasks[idx].completed = !tasks[idx].completed;
      saveTasks(tasks);
      renderTasks(tasks);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '删除';
    deleteBtn.setAttribute('aria-label', '删除任务');
    deleteBtn.onclick = () => {
      tasks.splice(idx, 1);
      saveTasks(tasks);
      renderTasks(tasks);
    };

    controls.appendChild(completeBtn);
    controls.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(controls);
    taskList.appendChild(li);
  });
}

function setFilter(newFilter) {
  filter = newFilter;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  if (filter === 'all') {
    filterAllBtn.classList.add('active');
  } else if (filter === 'pending') {
    filterPendingBtn.classList.add('active');
  } else if (filter === 'completed') {
    filterCompletedBtn.classList.add('active');
  }
  renderTasks(tasks);
}

filterAllBtn.onclick = () => setFilter('all');
filterPendingBtn.onclick = () => setFilter('pending');
filterCompletedBtn.onclick = () => setFilter('completed');

// Theme toggle logic
function loadTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    themeToggle.textContent = '🌙';
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  const theme = isDark ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
  themeToggle.textContent = isDark ? '☀️' : '🌙';
}

themeToggle.onclick = toggleTheme;

loadTheme();
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  return JSON.parse(localStorage.getItem('tasks') || '[]');
}

let tasks = loadTasks();
renderTasks(tasks);

taskForm.onsubmit = function(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.value = '';
    taskInput.focus();
    return;
  }
  tasks.push({ text, completed: false });
  saveTasks(tasks);
  renderTasks(tasks);
  taskInput.value = '';
  taskInput.focus();
};