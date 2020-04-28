const Jnl = db.define('jnl',
    {
        id: {
            label: "Journal ID",
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true,
        },
        fileId: {
            label: "File",
            allowNull: false,
            type: Sequelize.STRING(50),
        },
        accId: {
            label: "Counterpart Account",
            type: Sequelize.STRING(50),
        },
        name: {
            label: "Journal Name",
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Journal Name is required"
                }
            }
        },
        active: {
            label: "Journal Active",
            type: Sequelize.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Journal Active is required"
                }
            }
        },
        type: {
            label: "Reference",
            type: Sequelize.ENUM("BUY", "SELL", "BUY_CN", "SELL_CN", "FINANCE", "DIVERSE"),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "Journal Type is required"
                }
            }
        },
        // nextRef: {
        //     label: "Next Document Number",
        //     type: Sequelize.INTEGER,
        // },
    },
    {
        freezeTableName: true,
        order: [["type", "ASC"], ["name", "ASC"]]
    }
)

// console.log("Jnl.table*", Jnl.tableName)
// console.log("Jnl.PK*", Jnl.primaryKeyAttributes)
// console.log("Jnl.fiels*", Jnl.rawAttributes)
global.Jnl = Jnl
module.exports = Jnl 