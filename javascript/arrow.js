class NameField {
    constructor(name) {
        const field = document.createElement('li');
        field.textContent = name;
        const nameListHook = document.querySelector('#names');
        nameListHook.appendChild(field);
    }
}
class NameGenerator {
    constructor() {
        const btn = document.querySelector('button');
        this.names = ['jerry', ' dip', 'kashyap'];
        this.currentName = 0;
        // by using bind
        // btn.addEventListener('click', this.addName.bind(this));  
        // by using arrow function 
        btn.addEventListener('click', () => { this.addName(); });
    }
    addName() {
        const name = new NameField(this.names[this.currentName]);
        this.currentName++;
        if (this.currentName >= this.names.length) {
            this.currentName = 0;
        }
    }
}
const gen = new NameGenerator();