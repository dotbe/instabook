const Line = db.define('line',
    {
        lineId: {
            label: "Line ID",
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: {
                    msg: "Line ID is required"
                }
            }
        },
        docId: {
            label: "Document ID",
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Document is required"
                }
            }
        },
        accId: {
            label: "File",
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Account is required"
                }
            }
        },
        lineName: {
            label: "Label",
            type: Sequelize.STRING(50),
            allowNull: true
        },
        lineAmount: {
            label: "Amount",
            type: Sequelize.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Amount is required"
                }
            }
        },
        lineIndex: {
            label: "Index",
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        order: [["lineIndex" ,"ASC"]]
    }
);

console.log("Line.table*", Line.tableName)
console.log("Line.PK*", Line.primaryKeyAttributes)
// console.log("Line.fields*", Line.rawAttributes)
global.Line = Line;
module.exports = Line;