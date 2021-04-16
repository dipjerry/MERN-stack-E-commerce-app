const fs = require('fs');
console.log('Hello from node.js');
fs.writeFileSync('hello.txt', 'hello from node.js')