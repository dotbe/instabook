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
        ref: {
            type: Sequelize.STRING(50),
        },
        regDate: {
            type: Sequelize.DATEONLY,
        },
        comment: {
            type: Sequelize.STRING(50),
        },
        amount: {
            type: Sequelize.DOUBLE(10, 2),
        },
        d: {
            type: Sequelize.DOUBLE(10, 2),
        },
        c: {
            type: Sequelize.DOUBLE(10, 2),
        },
        i: {
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