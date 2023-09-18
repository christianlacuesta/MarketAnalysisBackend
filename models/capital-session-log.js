const Sequelize = require('sequelize');
const sequelize = require('../helpers/database');

const CapitalSession = sequelize.define('capital-session-log', {
    sessionId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    sessionInfo: {
        type: Sequelize.JSON,
        allowNull: false,
    },
});

module.exports = CapitalSession;