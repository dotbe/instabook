const File = db.define('file',
    {
        id: {
            label: "File ID",
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true,
        },
        name: {
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
        taxRef: {
            type: Sequelize.STRING(50),
            unique: true,
            defaultValue: null,
            validate: {
                len: {
                    args: [3, 20],
                    msg: "Tax Reference must be between 3 and 20"
                }
            }
        },
    },
    {
        tableName: "file",
        freezeTableName: true,
        order: [["name" ,"ASC"]],
       
    }
)


// console.log("File.table*", File.tableName)
// console.log("File.PK*", File.primaryKeyAttributes)
//console.log("File.fields*", File.rawAttributes)
global.File = File
module.exports = File