const Acc = db.define('Acc',
    {
        id: {
            label: "Account ID",
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true,
        },
        defAccId: {
            label: "Counterpart Account",
            type: Sequelize.STRING(50),
        },
        vatCode: {
            label: "Default VAT",
            type: Sequelize.STRING(50),
        },
        code: {
            label: "Account Code",
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Account Code is required"
                }
            }
        },
        name: {
            label: "Account Name",
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Account Name is required"
                }
            }
        },
        active: {
            label: "Account Active",
            type: Sequelize.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Journal Active is required"
                }
            }
        },
    },
    {
        freezeTableName: true,
        order: [["code" ,"ASC"]]
    }
);

// console.log("Acc.table*", Acc.tableName)
// console.log("Acc.PK*", Acc.primaryKeyAttributes)
// console.log("Acc.fields*", Acc.rawAttributes)
global.Acc = Acc
module.exports = Acc