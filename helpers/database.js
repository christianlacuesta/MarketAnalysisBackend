const Sequelize = require('sequelize');
const sequelize = new Sequelize('market-analysis', 'root', 'Solomon33', {
    dialect: 'mysql',
    host: 'localhost',
    pool: {
        max: 1000,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
});

module.exports = sequelize;