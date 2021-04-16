const person = {
    name: 'Max',
    age: 29,
    greet() {
        console.log('Hello i am ' + this.name);
    }
};

const copyArray = {...person };
console.log(copyArray);
person.greet();