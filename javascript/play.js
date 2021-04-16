// learn variable , function and how to call then.
// var name = 'dip';
// var age = 22;
// var hasHobbies = true;
const name = 'dip';
let age = 22;
let hasHobbies = true;
age = 30;
// normal function 
function summariseUser(userName, userAge, hasHobbies) {
    return ('Name is ' + userName + ', age is ' + userAge + ' and the usewr has hobbis ? ' + hasHobbies);
}
// name function 
var summariseUser_name = function(userName, userAge, hasHobbies) {
    return ('Name is ' + userName + ', age is ' + userAge + ' and the usewr has hobbis ? ' + hasHobbies);
}

var summariseUser_arrow = (userName, userAge, hasHobbies) => {
    return ('Name is ' + userName + ', age is ' + userAge + ' and the usewr has hobbis ? ' + hasHobbies);
}
console.log(summariseUser(name, age, hasHobbies));
console.log(summariseUser_name(name, age, hasHobbies));
console.log(summariseUser_arrow(name, age, hasHobbies));