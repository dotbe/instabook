//const Sequelize = require('Sequelize');
const db = new Sequelize('instabook', 'root', 'online', {
  logging: console.log,
  hostname: 'localhost',
  dialect: 'mysql',
  operatorAliases: false
})
global.db = db;
module.exports = db;

const File = require('../models/File')
const Acc = require('../models/Acc')
const Jnl = require('../models/Jnl')
const Doc = require('../models/Doc')
const Line = require('../models/Line')

File.hasMany(Doc, {foreignKey: 'fileId'})
Doc.belongsTo(File, {foreignKey: 'fileId'}) // hasOne: fk in File vs belongsTo: fk in Doc

Jnl.hasMany(Doc, {foreignKey: 'jnlId'})
Doc.belongsTo(Jnl, {foreignKey: 'jnlId'})

Doc.hasMany(Line, {foreignKey: 'docId'})
Line.belongsTo(Doc, {foreignKey: 'docId'})

Acc.hasMany(Line, {foreignKey: 'accId'})
Line.belongsTo(Acc, {foreignKey: 'accId'})