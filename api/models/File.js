const File = db.define('file',
    {
        fileId: {
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: {
                    msg: "ID is required"
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
        freezeTableName: true,
        order: [["fileName" ,"ASC"]],
       
    }
);


console.log("File.table*", File.tableName)
console.log("File.PK*", File.primaryKeyAttributes)
//console.log("File.fields*", File.rawAttributes)
global.File = File;
module.exports = File;