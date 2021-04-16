var name = 'dip';
console.log(name);

var secondName = name;
console.log(secondName);

var person = {
    name: 'dip',
    age: 22,
    hobbies: ['coding', 'illustration']
};
console.log(person);

var secondPerson = person;
console.log(secondPerson);
person.name = 'jerry';
console.log(secondPerson);