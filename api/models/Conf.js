const Conf = db.define('Conf',
    {
        id: {
            label: "Key",
            type: Sequelize.STRING(10),
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: {
                    msg: "Account Code is required"
                }
            }
        },
        val: {
            label: "Value",
            type: Sequelize.STRING(50),
        },
    },
    {
        freezeTableName: true,
        order: [["id" ,"ASC"]],
        timestamps: false
    }
);

// console.log("Acc.table*", Acc.tableName)
// console.log("Acc.PK*", Acc.primaryKeyAttributes)
// console.log("Acc.fields*", Acc.rawAttributes)
global.Conf = Conf
module.exports = Conf 