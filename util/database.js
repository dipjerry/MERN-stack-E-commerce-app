// const mysql = require('mysql2')

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-component',
//     password: 'groot',
//     port: 3360
// });
const Sequelize = require('sequelize')
const sequelize = new Sequelize('node-componment', 'root', 'groot', { dialect: 'mysql', host: 'localhost', port: '3360' })


module.exports = sequelize;