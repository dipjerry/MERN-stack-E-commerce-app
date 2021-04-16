const mysql = require('mysql2')
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-component',
    password: 'groot',
    port: 3360
});

module.exports = pool.promise();