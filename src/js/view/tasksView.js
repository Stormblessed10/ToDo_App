import { View } from "./view";

class TasksView extends View {
    _data;
    _parentEl = document.querySelector('.content');
    _container = this._parentEl.querySelector('.todo-list');
    _selected;
    _id = 0;
    clicked;

    constructor() {
        super();
        document.querySelector('.side-bar').addEventListener('click', this.moveFormEdit.bind(this));
        document.querySelector('.side-bar').addEventListener('click', this._closeForm.bind(this));
        this._parentEl.addEventListener('click', function(e) {
            if (e.target.classList.contains('form-btn__cancel')) {
                this._closeForm();
                this.moveFormEdit();
            }
            
            if (e.target.classList.contains('btn-open-form')) {
                this._openForm();
                this.moveFormEdit();
            }

            if (e.target.classList.contains('edit__change')) {
                this._closeForm();
                this._openEdit(e);
            }
        }.bind(this));
    }

    addHandlerFinishTask(handler) {
        document.addEventListener('click', function(e) {
            if (!e.target.classList.contains('todo__complete')) return;
            const todo = e.target.closest('.todo');
            todo.querySelector('.todo__text').classList.toggle('checked');
            this.clicked = todo.id;
            handler();
        }.bind(this));
    }

    renderEmpty() {
        this._addHidden('.btn-open-form');
        this._container.innerHTML = '';
        this._parentEl.querySelector('h1').textContent = 'NO DATA';
    }

    renderAllTasks(data) {
        this._data = data;
        const markup = this._generateMarkupAll();
        this._parentEl.querySelector('h1').textContent = data.title;
        this._container.innerHTML = markup;
        this._removeHidden('.btn-open-form');
        if(this._data.id !== 'allTasks'
        && this._data.id !== 'today'
        && this._data.id !== 'week') return;
        this._addHidden('.btn-open-form');
    }

    addHandlerRemoveTask(handler) {
        this._parentEl.addEventListener('click', function(e) {
            if (!e.target.classList.contains('edit__delete')) return;
            const todo = e.target.closest('.todo');
            handler(todo.dataset.projectId, todo.id);
            todo.remove();
            this._parentEl.querySelectorAll('.todo').forEach(task => {
                if (task.id > todo.id) task.id -= 1;
            });
        }.bind(this));
    }

    loadTasksHandler(handler) {
        window.addEventListener('hashchange', function() {
            handler();
        });
    }
    
    updateTask(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();
        if (this._id) this._id--;
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        newDOM.querySelector('li').id = this._selected;
        const newEls = Array.from(newDOM.querySelector('li').querySelectorAll('*'));
        const currentEls = Array.from(document.getElementById(this._selected).querySelectorAll('*'));

        // Replace priority class
        currentEls[0].closest('li').classList.replace(currentEls[0].closest('li').className.split(' ')[1], newEls[0].closest('li').className.split(' ')[1]);

        newEls.forEach((newEl, i) => {
            const currentEl = currentEls[i];
            if (!newEl.isEqualNode(currentEl)
            && newEl.firstChild?.nodeValue?.trim() !== '') currentEl.textContent = newEl.textContent;
        });
    }

    getTask() {
        const data = ['title', 'details', 'date', 'priority'].map(el => this._parentEl.querySelector(`.todo-form__${el}`).value);
        data.push(this._selected);
        data.push(window.location.hash.slice(1));
        return data;
    }

    _generateMarkupAll() {
        this._id =  this._data.tasks.length;
        return this._data.tasks.map((task, i) => {
            return `
            <li class="todo priority-${task.priority === '2' ? 'high' : task.priority === '1' ? 'medium' : 'low'}" id="${i}" data-project-id="${task.projectId}">
                <label><input class="todo__complete" type="checkbox" ${task.checked ? 'checked' : ''}></label>
                <div class="todo__text ${task.checked ? 'checked' : ''}">
                    <h3 class="todo__title">${task.title}</h3>
                    <p class="todo__details">${task.details}</p>
                </div>
                <time class="todo__date">${task.date}</time>
                <div class="edit">
                    <div class="edit__options hidden">
                        <button class="edit__delete">Delete</button>
                        <button class="edit__change">Edit</button>
                    </div>
                    <button class="edit__open">
                    <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M480.571 934q-29.571 0-50.57-20.884-21-20.884-21-50.21 0-28.838 20.835-50.372 20.835-21.533 50.093-21.533 30.071 0 50.571 21.503 20.499 21.503 20.499 50.499 0 28.997-20.429 49.997t-49.999 21Zm0-287.001q-29.571 0-50.57-20.835-21-20.835-21-50.093 0-30.071 20.835-50.571 20.835-20.499 50.093-20.499 30.071 0 50.571 20.429 20.499 20.429 20.499 49.999 0 29.571-20.429 50.571-20.429 20.999-49.999 20.999Zm0-286q-29.571 0-50.57-21.212-21-21.213-21-51t20.835-50.62q20.835-20.833 50.093-20.833 30.071 0 50.571 20.927 20.499 20.928 20.499 50.715 0 29.787-20.429 50.905-20.429 21.118-49.999 21.118Z"/></svg>
                    </button>
                </div>
            </li>
            `
        }).join('');
    }

    _generateMarkup() {
        const markup = `
        <li class="todo priority-${this._data.priority === '2' ? 'high' : this._data.priority === '1' ? 'medium' : 'low'}" id="${this._id}" data-project-id="${this._data.projectId}">
            <label><input class="todo__complete" type="checkbox"></label>
            <div class="todo__text ${this._data.checked ? 'checked' : ''}">
                <h3 class="todo__title">${this._data.title}</h3>
                <p class="todo__details">${this._data.details}</p>
            </div>
            <time class="todo__date">${this._data.date}</time>
            <div class="edit">
                <div class="edit__options hidden">
                    <button class="edit__delete">Delete</button>
                    <button class="edit__change">Edit</button>
                </div>
                <button class="edit__open">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M480.571 934q-29.571 0-50.57-20.884-21-20.884-21-50.21 0-28.838 20.835-50.372 20.835-21.533 50.093-21.533 30.071 0 50.571 21.503 20.499 21.503 20.499 50.499 0 28.997-20.429 49.997t-49.999 21Zm0-287.001q-29.571 0-50.57-20.835-21-20.835-21-50.093 0-30.071 20.835-50.571 20.835-20.499 50.093-20.499 30.071 0 50.571 20.429 20.499 20.429 20.499 49.999 0 29.571-20.429 50.571-20.429 20.999-49.999 20.999Zm0-286q-29.571 0-50.57-21.212-21-21.213-21-51t20.835-50.62q20.835-20.833 50.093-20.833 30.071 0 50.571 20.927 20.499 20.928 20.499 50.715 0 29.787-20.429 50.905-20.429 21.118-49.999 21.118Z"/></svg>
                </button>
            </div>
        </li>
        `;
        this._id++;
        return markup;
    }
}

export default new TasksView();
