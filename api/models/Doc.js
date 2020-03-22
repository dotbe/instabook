const Doc = db.define('doc',
    {
        docId: {
            label: "Document ID",
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: {
                    msg: "Document ID is required"
                }
            }
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
        docRef: {
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

        docDate: {
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
        order: [["docRef", "ASC"]]
    }
);

console.log("Doc.table*", Doc.tableName)
console.log("Doc.PK*", Doc.primaryKeyAttributes)
// console.log("Doc.fields*", Doc.rawAttributes)

global.Doc = Doc;
module.exports = Doc;