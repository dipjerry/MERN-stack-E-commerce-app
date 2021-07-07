const person = {
    name: 'Jerry',
    age: 22,
    greet() {
        console.log('Hello i am ' + this.name);
    }
};
const printName = ({ name }) => {
    console.log(name);
};
printName(person);
// via object destructuring 
const { name, age } = person;
console.log(name, age);
// array destruturing 
const hobbies = ['games', 'programming', 'digital art'];
let [hobby1, hobby2] = hobbies;
console.log(hobby1, hobby2);