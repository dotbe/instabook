//const Sequelize = require('Sequelize');
const db = new Sequelize('instabook', 'root', 'online', {
  logging: console.log,
  hostname: 'localhost',
  dialect: 'mysql',
  operatorAliases: false,
  define:{timestamps: false},
})
global.db = db;
module.exports = db;

const File = require('./File')
const Acc = require('./Acc')
const Jnl = require('./Jnl')
const Doc = require('./Doc')
const Line = require('./Line')
const V_Line = require('./V_Line')
const Conf = require('./Conf')
const Vat = require('./Vat')

File.hasMany(Jnl)
Jnl.belongsTo(File) // hasOne: fk in File vs belongsTo: fk in Doc

Jnl.hasMany(Doc)
Doc.belongsTo(Jnl)

Doc.hasMany(Line)
Line.belongsTo(Doc)

Doc.hasMany(V_Line)
V_Line.belongsTo(Doc)

Acc.hasMany(Line)
Line.belongsTo(Acc)