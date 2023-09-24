const sequelize = require('../helpers/database');
const { QueryTypes } = require('sequelize');

exports.marketHistory = async (req, res, next) => {

    const tableName = '`market-analysis`.`capital-session-logs`';

    const response = await sequelize.query(`select * from ${tableName}  ORDER BY sessionId DESC LIMIT 1`, {
        type: QueryTypes.SELECT
    }).catch(err => {console.log(`Error37: ${err}`);});
 
    let requestOptions = {
      method: 'GET',
      headers: {
        "X-SECURITY-TOKEN": response[0].sessionInfo.sessionInfo.securityToken,
        "CST": response[0].sessionInfo.sessionInfo.cst
      },
      redirect: 'follow'
    };
  
  
    const market = await fetch(`https://api-capital.backend-capital.com/api/v1/prices/${req.body.epic}?resolution=MINUTE&max=1000`, requestOptions)
      .then(response => response.text())
      .then(result => {return result})
      .catch(error => {return error});
  
    const prices = JSON.parse(market).prices;

    res.status(200).json(prices);
  }