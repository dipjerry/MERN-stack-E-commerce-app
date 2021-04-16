const http = require('http');
const route = require('./temporary/routes');
const hostname = '127.0.0.1';
const port = 3000;
console.log(route.someText);
const server = http.createServer(route.handler);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});