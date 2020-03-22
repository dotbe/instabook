const Jnl = db.define('jnl',
    {
        jnlId: {
            label: "Journal ID",
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: {
                    msg: "Journal ID is required"
                }
            }
        },
        jnlName: {
            label: "Journal Name",
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Journal Name is required"
                }
            }
        },
        jnlActive: {
            label: "Journal Active",
            type: Sequelize.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Journal Active is required"
                }
            }
        },
        jnlType: {
            label: "Reference",
            type: Sequelize.ENUM("BUY", "SELL", "FINANCE", "DIVERSE"),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "Journal Type is required"
                }
            }
        }
    },
    {
        freezeTableName: true,
        order: [["jnlType" ,"ASC"], ["jnlName" ,"ASC"]]
    }
);

console.log("Jnl.table*", Jnl.tableName)
console.log("Jnl.PK*", Jnl.primaryKeyAttributes)
// console.log("Jnl.fiels*", Jnl.rawAttributes)
global.Jnl = Jnl;
module.exports = Jnl;