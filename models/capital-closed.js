const Sequelize = require('sequelize');
const sequelize = require('../helpers/database');

const CapitalClosedPosition = sequelize.define('capital-closed', {
    positionClosedId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    positionClosedInfo: {
        type: Sequelize.JSON,
        allowNull: false,
    },
});

module.exports = CapitalClosedPosition;