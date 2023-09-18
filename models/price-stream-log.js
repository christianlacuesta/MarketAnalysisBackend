const Sequelize = require('sequelize');
const sequelize = require('../helpers/database');

const PriceStream = sequelize.define('price-stream-log', {
    priceStreamId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    priceStreamInfo: {
        type: Sequelize.JSON,
        allowNull: false,
    },
});

module.exports = PriceStream;