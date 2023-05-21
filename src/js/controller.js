import '../scss/index.scss';
import * as model from './model';
import sideView from './view/sideView';
import tasksView from './view/tasksView';

function getId() {
    return model.state.projects.find(project => project.id === window.location.hash.slice(1));
}

function launch() {
    window.location.hash = '#allTasks';
    model.AddHomeTasks();
    sideView.renderAllProjects(model.state.projects);
    tasksView.renderAllTasks(getId());
}

function controlAddProject() {
    const data = sideView.getProjectData(); 
    if (!data[0].trim()) return; 
    model.addProject(data[0]);
    sideView.render(model.state.project);
}

function controlAddTasks() {
    const data = tasksView.getTask();
    model.addTasks(data);
    tasksView.render(model.state.task);
    model.AddHomeTasks();
}

function controlRemoveTask(projectId, taskId) {
    model.removeTask(projectId, taskId);
    model.AddHomeTasks();
}

function controlRemoveProject(projectId) {
    tasksView.moveFormEdit();
    model.removeProject(projectId);
    model.AddHomeTasks();
    if (projectId === window.location.hash.slice(1)) tasksView.renderEmpty();
    else tasksView.renderAllTasks(getId());
}

function loadTasks() {
    tasksView.renderAllTasks(getId());
}

function controlEditTask() {
    const data = tasksView.getTask();
    model.editTask(data);
    tasksView.updateTask(model.state.task);
    model.AddHomeTasks();
}

function controlEditProject() {
    model.editProject(sideView.getProjectData());
    sideView.updateProject(model.state.project)
}

function finishTask() {
    model.checkTask(tasksView.clicked);
}

function init() {
    launch();
    sideView.addHandler(controlAddProject);
    sideView.addHandlerRemoveProject(controlRemoveProject);
    sideView.addHandlerEdit(controlEditProject);
    tasksView.addHandler(controlAddTasks);
    tasksView.loadTasksHandler(loadTasks);
    tasksView.addHandlerFinishTask(finishTask);
    tasksView.addHandlerEdit(controlEditTask);
    tasksView.addHandlerRemoveTask(controlRemoveTask);
}

init();
