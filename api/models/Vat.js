const Vat = db.define('Vat',
    {
        id: {
            label: "VAT ID",
            type: Sequelize.STRING(50),
            allowNull: false,
            primaryKey: true,
        },
        jnlType: {
            label: "Journal Type",
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        code: {
            label: "Code",
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        box: {
            label: "VAT Box",
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        accId: {
            label: "VAT Account",
            allowNull: false,
            type: Sequelize.STRING(50),
        },
        pc: {
            label: "Pourcentage",
            type: Sequelize.DOUBLE(10, 2),
            allowNull: false,
        },
        baseBox: {
            label: "Base Box",
            type: Sequelize.STRING(10),
            allowNull: false,
        },

    },
    {
        freezeTableName: true,
        order: [["jnlType", "ASC"], ["code", "ASC"]]
    }
)

// console.log("Line.table*", Line.tableName)
// console.log("Line.PK*", Line.primaryKeyAttributes)
// console.log("Line.fields*", Line.rawAttributes)
global.Vat = Vat
module.exports = Vat