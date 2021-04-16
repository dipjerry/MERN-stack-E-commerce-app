const hobbies = ['Sport', 'cooking', 22];
for (let hobby of hobbies) {
    console.log(hobby);
}
console.log(hobbies.map(hobby => 'Hobby : ' + hobby));
console.log(hobbies);
hobbies.push('Programming');
console.log(hobbies);
// use spread operator
const copiedArray = [...hobbies];
console.log(copiedArray);
//use ret operator 
const toArray = (...arg) => {
    return arg;
};
console.log(toArray(1, 2, 3, 4, 'groot'));