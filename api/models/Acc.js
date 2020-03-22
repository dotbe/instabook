const Acc = db.define('Acc',
    {
        accId: {
            label: "Account ID",
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: {
                    msg: "Account ID is required"
                }
            }
        },
        accCode: {
            label: "Account Code",
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Account Code is required"
                }
            }
        },
        accName: {
            label: "Account Name",
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Account Name is required"
                }
            }
        },
        accActive: {
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
        order: [["accId" ,"ASC"]]
    }
);

console.log("Acc.table*", Acc.tableName)
console.log("Acc.PK*", Acc.primaryKeyAttributes)
// console.log("Acc.fields*", Acc.rawAttributes)
global.Acc = Acc;
module.exports = Acc;