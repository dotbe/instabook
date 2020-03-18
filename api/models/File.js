const File = db.define('file', {
    fileId: { type: Sequelize.STRING(50), allowNull: false, primaryKey:true },
    fileName: { type: Sequelize.STRING(50), allowNull: false, unique: true },
    fileVAT: { type: Sequelize.STRING(50), allowNull: true, unique: true, defaultValue: null },

});

console.log("File.primaryKeyAttributes", File.primaryKeyAttributes)
console.log("File.rawAttributes", File.rawAttributes)

File.schema = {
    fileId: Joi.string().guid(),
    fileName: Joi.string().min(3).max(50).required(),
    fileVAT: Joi.string()
}
module.exports = File;