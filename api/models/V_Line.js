const V_Line = db.define('v_line',
    {
        id: {
            primaryKey: true,
            type: Sequelize.STRING(50),
        },
        fileId: {
            type: Sequelize.STRING(50),
        },
        jnlId: {
            type: Sequelize.STRING(50),
        },
        docId: {
            type: Sequelize.STRING(50),
        },
        accId: {
            type: Sequelize.STRING(50),
        },

        jnlName: {
            type: Sequelize.STRING(50),
        },
        jnlType: {
            type: Sequelize.STRING(50),
        },
        docRef: {
            type: Sequelize.STRING(50),
        },
        docRegDate: {
            type: Sequelize.DATEONLY,
        },
        lineName: {
            type: Sequelize.STRING(50),
        },
        lineAmount: {
            type: Sequelize.DOUBLE(10, 2),
        },
        lineD: {
            type: Sequelize.DOUBLE(10, 2),
        },
        lineC: {
            type: Sequelize.DOUBLE(10, 2),
        },
        lineI: {
            type: Sequelize.INTEGER,
        },
        accCode: {
            type: Sequelize.STRING(50),
        },
        accName: {
            type: Sequelize.STRING(50),
        },
    },
    {
        freezeTableName: true,
    }
)

// console.log("Line.table*", Line.tableName)
// console.log("Line.PK*", Line.primaryKeyAttributes)
// console.log("Line.fields*", Line.rawAttributes)
global.V_Line = V_Line
module.exports = V_Line