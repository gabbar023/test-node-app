const Sequelize= require('sequelize')

//connecting to mysql server
const sequelize= new Sequelize('online_shop','root','password', {dialect:'mysql',host: 'localhost'})

module.exports = sequelize;