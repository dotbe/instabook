const Doc = db.define('doc',
    {
        id: {
            label: "Document ID",
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true,
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
            label: "Document Number",
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "Document Number is required"
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
)

// console.log("Doc.table*", Doc.tableName)
// console.log("Doc.PK*", Doc.primaryKeyAttributes)
// console.log("Doc.fields*", Doc.rawAttributes)

global.Doc = Doc
module.exports = Doc