const File = db.define('file',
    {
        fileId: {
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: {
                    msg: "File ID is required"
                }
            }
        },
        fileName: {
            label: "File Name",
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: [3, 20],
                    msg: "File Name must be between 3 and 20"
                }
            }
        },
        fileVAT: {
            type: Sequelize.STRING(50),
            unique: true,
            defaultValue: null,
            validate: {
                len: {
                    args: [3, 20],
                    msg: "VAT must be between 3 and 20"
                }
            }
        }
    },
    {
        freezeTableName: true
    }
);

console.log("File.tableName*", File.tableName)
console.log("File.primaryKeyAttributes*", File.primaryKeyAttributes)
console.log("File.rawAttributes*", File.rawAttributes)


File.schema = {
    fileId: Joi.string().guid(),
    fileName: Joi.string().min(3).max(50).required(),
    fileVAT: Joi.string()
}
module.exports = File;