const Sequelize=require('sequelize')

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

//drop  particular table 
//Product.drop()

module.exports = Order;



