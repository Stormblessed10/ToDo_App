export class View {
    // _data;

    _closeForm() {
        this._addHidden('.formAdd');
        this._clearInput();
    }

    _openForm() {
        this._removeHidden('.formAdd');
        this._parentEl.querySelector('.input').focus();
    }

    _clearInput() {
        this._parentEl.querySelectorAll('.input').forEach(input => {
            input.value = '';
        });
    }

    _addHidden(selector) {
        return this._parentEl.querySelector(selector)?.classList.add('hidden');
    }

    _removeHidden(selector) {
        return this._parentEl.querySelector(selector)?.classList.remove('hidden');
    }

    _dropdown() {
        document.addEventListener('click', function(e) {
            const menu = e.target.closest('.edit');
            if (!menu) {
                document.querySelectorAll('.edit__options').forEach(el => {
                    if (el.classList.contains('hidden')) return;
                    el.classList.add('hidden');
                });
                return;
            };
            document.querySelectorAll('.edit__options').forEach(el => {
                if (el.classList.contains('hidden')) return;
                el.classList.add('hidden');
            });
            menu.querySelector('.edit__options').classList.toggle('hidden');
        });
    }

    _openEdit(e) {
        this.moveFormEdit();
        const li = e.target.closest('li');
        const form = this._parentEl.querySelector('.formEdit');

        if (li.classList.contains('todo')) {
            ['#titleEdit', '#detailsEdit', '#dateEdit'].forEach(name => {
                form.querySelector(name).value = li.querySelector(`.todo__${name.slice(1, -4)}`).textContent;
            });
            form.querySelector('#priorityEdit').value = li.classList.contains('priority-high') ? '2' : li.classList.contains('priority-medium') ? '1' : '0';
            
        } else form.querySelector('input').value = li.querySelector('a').textContent;
        
        
        form.classList.remove('hidden');
        li.classList.add('hidden');
        this._container.appendChild(form);
        this._container.insertBefore(form, li);
        this._selected = li.id;
    }

    render(data) {
        this._data = data;
        const markup = this._generateMarkup();
        this._container.insertAdjacentHTML('beforeend', markup);
    }

    addHandler(handler) {
        this._parentEl.addEventListener('click', function(e) {
            if (!e.target.classList.contains('form-btn__add')) return;
            handler();
            this._closeForm();
        }.bind(this));
    }

    moveFormEdit() {
        this._removeHidden('li.hidden');
        this._addHidden('.formEdit');
        this._parentEl.appendChild(this._parentEl.querySelector('.formEdit'));
    }

    addHandlerEdit(handler) {
        this._parentEl.addEventListener('click', function(e) {
            if (!e.target.classList.contains('form-btn__edit')) return;
            handler();
            this.moveFormEdit();
            this._closeForm();
        }.bind(this));
    }
} 