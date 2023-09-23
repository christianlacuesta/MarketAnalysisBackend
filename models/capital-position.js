const Sequelize = require('sequelize');
const sequelize = require('../helpers/database');

const CapitalPosition = sequelize.define('capital-position', {
    positionId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    positionInfo: {
        type: Sequelize.JSON,
        allowNull: false,
    },
});

module.exports = CapitalPosition;