const Sequelize = require('sequelize')
const sequelize = new Sequelize('node-component', 'root', 'groot', { dialect: 'mysql', host: 'localhost', port: 3360 })


module.exports = sequelize;