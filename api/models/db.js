//const Sequelize = require('Sequelize');
const db = new Sequelize('instabook', 'root', 'online', {
  logging: console.log,
  hostname: 'localhost',
  dialect: 'mysql',
  operatorAliases: false
})
global.db = db;
module.exports = db;

const File = require('./File')
const Acc = require('./Acc')
const Jnl = require('./Jnl')
const Doc = require('./Doc')
const Line = require('./Line')
const Conf = require('./Conf')

File.hasMany(Jnl)
Jnl.belongsTo(File) // hasOne: fk in File vs belongsTo: fk in Doc

Jnl.hasMany(Doc)
Doc.belongsTo(Jnl)

Doc.hasMany(Line)
Line.belongsTo(Doc)

Acc.hasMany(Line)
Line.belongsTo(Acc)