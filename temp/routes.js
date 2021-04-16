const fs = require('fs')
const requestHAndler = (req, res) => {
        const url = req.url;
        const method = req.method;

        if (url === '/') {
            res.write('<html>');
            res.write('<head><title>Enter message</title></head>');
            res.write('<body><form action="/message" method="POST"><input type="text" name="message"><input type="submit"> </form></body>');
            res.write('</html>');
            return res.end();
        }
        if (url === '/message' && method === 'POST') {
            const body = [];
            // read incomming request in buffer
            req.on('data', chunk => {
                console.log(chunk);
                body.push(chunk);
            });

            // another listner that will be execute after parsing thew incoming requested data
            return req.on('end', () => {
                const parseBody = Buffer.concat(body).toString(); // lets say , buffer is the bus stop where , and chunks are waiting at the bus stop as a bus
                console.log('The parsed body that we will worked with ' + parseBody);
                const message = parseBody.split('=')[1];
                // fs.writeFileSync('message.txt', message);  sync blocks future executioon of the code untill completed
                fs.writeFile('message.txt', message, err => {
                    // this part will only be excecuted only if we are done working with the file
                    res.statusCode = 302;
                    res.setHeader('Location', '/')
                    return res.end();
                });
            });
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>First Node App</title></head>');
        res.write('<body>Hello world</body>');
        res.write('</html>');
        res.end('Hello Worlds');
        // console.log(req);
    }
    // module.exports = requestHAndler;
module.exports = { handler: requestHAndler, someText: 'hello object' };