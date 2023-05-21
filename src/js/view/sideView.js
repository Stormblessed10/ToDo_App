import { View } from "./view";

class SideView extends View {
    _data;
    _parentEl = document.querySelector('.side-bar');
    _container = this._parentEl.querySelector('.projects');
    _selected;

    constructor() {
        super();
        this._parentEl.addEventListener('click', function(e) {
            if (e.target.classList.contains('form-btn__cancel')) {
                this._closeForm()
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
        this._selectProject();
        this._dropdown();
        this._toggleSideBar();
    }

    getProjectData() {
        return [this._parentEl.querySelector('.side-bar__input').value, this._selected];
    }

    addHandlerRemoveProject(handler) {
        this._parentEl.addEventListener('click', function(e) {
            if (!e.target.classList.contains('edit__delete')) return;
            const project = e.target.closest('li');
            handler(project.id);
            project.remove()
        }.bind(this));
    }

    renderAllProjects(data) {
        this._data = data;
        const markup = this._generateMarkupAll();
        this._container.innerHTML = markup;
    }


    updateProject(data) {
        this._data = data;
        if (window.location.hash.slice(1) === this._data.id) {
            document.querySelector('h1').textContent = this._data.title;
        }
        const newMarkup = this._generateMarkup();
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newEl = newDOM.querySelector('.side-bar__item-link');
        const currentEl = document.getElementById(this._selected).querySelector('.side-bar__item-link');

        if (!newEl.isEqualNode(currentEl)) currentEl.textContent = newEl.textContent;    
    }

    _toggleSideBar() {
        document.querySelector('.hide-side-bar').addEventListener('click', function() {
            this._parentEl.classList.toggle('slide');
            setTimeout(() => {
                // this._parentEl.style.display = 'none';
            }, 1000)
        }.bind(this));
    }
    

    _selectProject() {
        this._parentEl.addEventListener('click', function(e) {
            if (!e.target.classList.contains('side-bar__item-link')) return;

            this._parentEl.querySelectorAll('.side-bar__item').forEach(item => {
                if (item.classList.contains('selected')) item.classList.remove('selected');
            });
            e.target.closest('.side-bar__item').classList.add('selected');
        }.bind(this));
        window.scrollTo(0, 0);
    }

    _generateMarkupAll() {
        return this._data.map(project => {
            if (project.flag === 'home') return;
            return `
            <li class="side-bar__item" id="${project.id}">
                <a class="side-bar__item-link" href="#${project.id}">${project.title}</a>
                <div class="edit">
                    <div class="edit__options hidden">
                        <button class="edit__delete">Delete</button>
                        <button class="edit__change">Rename</button>
                    </div>
                    <button class="edit__open">
                    <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M480.571 934q-29.571 0-50.57-20.884-21-20.884-21-50.21 0-28.838 20.835-50.372 20.835-21.533 50.093-21.533 30.071 0 50.571 21.503 20.499 21.503 20.499 50.499 0 28.997-20.429 49.997t-49.999 21Zm0-287.001q-29.571 0-50.57-20.835-21-20.835-21-50.093 0-30.071 20.835-50.571 20.835-20.499 50.093-20.499 30.071 0 50.571 20.429 20.499 20.429 20.499 49.999 0 29.571-20.429 50.571-20.429 20.999-49.999 20.999Zm0-286q-29.571 0-50.57-21.212-21-21.213-21-51t20.835-50.62q20.835-20.833 50.093-20.833 30.071 0 50.571 20.927 20.499 20.928 20.499 50.715 0 29.787-20.429 50.905-20.429 21.118-49.999 21.118Z"/></svg>
                    </button>
                </div>
            </li>`
        }).join('');  
    }

    _generateMarkup() {
        return `
        <li class="side-bar__item" id="${this._data.id}">
            <a class="side-bar__item-link" href="#${this._data.id}">${this._data.title}</a>
            <div class="edit">
                <div class="edit__options hidden">
                    <button class="edit__delete">Delete</button>
                    <button class="edit__change">Rename</button>
                </div>
                <button class="edit__open">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M480.571 934q-29.571 0-50.57-20.884-21-20.884-21-50.21 0-28.838 20.835-50.372 20.835-21.533 50.093-21.533 30.071 0 50.571 21.503 20.499 21.503 20.499 50.499 0 28.997-20.429 49.997t-49.999 21Zm0-287.001q-29.571 0-50.57-20.835-21-20.835-21-50.093 0-30.071 20.835-50.571 20.835-20.499 50.093-20.499 30.071 0 50.571 20.429 20.499 20.429 20.499 49.999 0 29.571-20.429 50.571-20.429 20.999-49.999 20.999Zm0-286q-29.571 0-50.57-21.212-21-21.213-21-51t20.835-50.62q20.835-20.833 50.093-20.833 30.071 0 50.571 20.927 20.499 20.928 20.499 50.715 0 29.787-20.429 50.905-20.429 21.118-49.999 21.118Z"/></svg>
                </button>
            </div>
        </li>`;        
    }
}

export default new SideView();
