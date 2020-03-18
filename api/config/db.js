//const Sequelize = require('Sequelize');
const db = new Sequelize('instabook', 'root', 'online', {
  logging: console.log,
  hostname: 'localhost',
  dialect: 'mysql',
  operatorAliases: false
})
global.db = db;
module.exports = db;

 