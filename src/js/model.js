export const state = {
    task: { 
        title: '',
        details: '',
        date: '',
        priority: '',
        checked: '',
    },
    project: {
        title: '',
        id: '',
        tasks: [],
    },
    projects: [
        {
            title: 'All Tasks',
            id: 'allTasks',
            tasks: [],
            flag: 'home',
        },
        {
            title: 'Today',
            id: 'today',
            flag: 'home',
            tasks: []
        },
        {
            title: 'Next 7 Days',
            id: 'week',
            flag: 'home',
            tasks: []
        },
    ],
};


export function addProject(projectTitle) {
    // const project = {
    //     title: projectTitle,
    //     id: Date.now().toString(),
    //     tasks: [],
    // };
    state.project = {
        title: projectTitle,
        id: Date.now().toString(),
        tasks: [],
    }
    const newProject = Object.assign({}, state.project);
    state.projects.push(newProject);

    saveDatalocal();
}

export function addTasks(taskData) {
    state.task = { 
        title: taskData[0],
        details: taskData[1],
        date: taskData[2],
        priority: taskData[3],
        projectId: taskData[5],
        checked: false,
    };
    const newTask = Object.assign({}, state.task);
    
    state.projects.find(project => project.id === window.location.hash.slice(1)).tasks.push(newTask);

    saveDatalocal();
}

export function checkTask(data) {
    const taskForCheck = state.projects.find(project => project.id === window.location.hash.slice(1))
    .tasks
    .find((task, i) => i == data);
    taskForCheck.checked = !taskForCheck.checked;

    saveDatalocal();
}

export function editTask(data) {
    const task = state.projects.find(project => project.id === window.location.hash.slice(1)).tasks.find((task, i) => i == data[4]);
    task.title = data[0];
    task.details = data[1];
    task.date = data[2];
    task.priority = data[3];
    state.task = task;

    saveDatalocal();
}

export function editProject(data) {
    const project = state.projects.find(project => project.id === data[1]);
    project.title = data[0];
    state.project = project;

    saveDatalocal();
}

export function removeTask(projectId, taskId) {
    state.projects.find(project => project.id === projectId).tasks.splice(taskId, 1);
    saveDatalocal();
}

export function removeProject(projectId) {
    state.projects.splice(findProjectIndex(projectId), 1);

    saveDatalocal();
}

export function AddHomeTasks() {
    addAllTasks();
    addTodayTasks();
    addWeekTasks();
    saveDatalocal();
}

function saveDatalocal() {
    localStorage.setItem('projects', JSON.stringify(state.projects));
}

function addAllTasks() {
    state.projects[findProjectIndex('allTasks')].tasks = state.projects.filter(project => project.flag !== 'home').flatMap(project => project.tasks);
}

function addTodayTasks() {
    state.projects[findProjectIndex('today')].tasks = state.projects[findProjectIndex('allTasks')].tasks.filter(task => task.date === new Date().toISOString().split('T')[0]);
}

function addWeekTasks() {
    state.projects[findProjectIndex('week')].tasks = state.projects[findProjectIndex('allTasks')].tasks.filter(task => task.date <= new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0] && task.date >= new Date().toISOString().split('T')[0]);
}

function findProjectIndex(index) {
    return state.projects.findIndex(project => project.id === index);
}

function init() {
    const storage = localStorage.getItem('projects');
    if (storage) state.projects = JSON.parse(storage);
}
init();