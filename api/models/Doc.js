const Doc = db.define('doc',
    {
        id: {
            label: "Document ID",
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true,
        },
        fileId: {
            label: "File",
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "File is required"
                }
            }
        },
        jnlId: {
            label: "Journal",
            type: Sequelize.STRING(50), 
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Journal is required"
                }
            }
        },
        ref: {
            label: "Reference",
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "Document Reference (number) is required"
                }
            }
        },

        regDate: {
            label: "File Name",
            type: Sequelize.DATEONLY,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "Document Date is required"
                }
            }
        }
    },
    {
        freezeTableName: true,
        order: [["regDate", "ASC"]]
    }
);

console.log("Doc.table*", Doc.tableName)
console.log("Doc.PK*", Doc.primaryKeyAttributes)
// console.log("Doc.fields*", Doc.rawAttributes)

global.Doc = Doc;
module.exports = Doc;