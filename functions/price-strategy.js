const resistances = require('../functions/resistances');
const supports = require('../functions/supports');
const trade = require('../functions/trade');


exports.recommendations = async(data) => {

  const timePeriod = 900000; // Specify the time period in which to look for support levels (in units of time)
  const minTests = 3;   // Minimum number of tests to consider a level as support

  const rList = await resistances.findResistanceLevels(data, timePeriod, minTests);
  const sList = await supports.findSupportLevels(data, timePeriod, minTests);
 
  const trades = await trade.simulateTrading(data, sList, rList);

  // console.log(trades)

  return ;
}