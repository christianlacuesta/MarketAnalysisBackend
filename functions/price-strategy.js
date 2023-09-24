const CapitalPosition = require('../models/capital-position');
const CapitalClosedPosition = require('../models/capital-closed');
const CapitalSell = require('./m-orders/capital-sell');
const CapitalBuy = require('./m-orders/capital-buy');
const CapitalClose = require('./m-orders/capital.close');
const sequelize = require('../helpers/database');
const { QueryTypes } = require('sequelize');
const cache = require('memory-cache');

exports.recommendations = async(dataStream, sessionInfo, epic) => {

  const statusChanges = [];

  let currentStatusChange = null;

  for (let i = 0; i < dataStream.length; i++) {
    const currentData = dataStream[i];
    const currentStatus = currentData.status;

    if (i === 0) {
      // Initialize the first status change
      currentStatusChange = {
        status: currentStatus,
        startTime: currentData.time,
        endTime: currentData.time,
        startPrice: currentData.price,
        endPrice: currentData.price,
        timeTaken: 0
      };
    } else {
      const previousData = dataStream[i - 1];
      const previousStatus = previousData.status;

      if (currentStatus !== previousStatus) {
        // Record the previous status change
        currentStatusChange.endTime = previousData.time;
        currentStatusChange.endPrice = previousData.price;
        currentStatusChange.timeTaken = currentStatusChange.endTime - currentStatusChange.startTime;

        // Push it to the statusChanges array
        statusChanges.push({ ...currentStatusChange });

        // Initialize a new status change
        currentStatusChange = {
          status: currentStatus,
          startTime: currentData.time,
          endTime: currentData.time,
          startPrice: currentData.price,
          endPrice: currentData.price,
          timeTaken: 0
        };
      } else {
        // Update the end time and end price for the current status change
        currentStatusChange.endTime = currentData.time;
        currentStatusChange.endPrice = currentData.price;
      }
    }
  }

  // Push the last status change (if any)
  if (currentStatusChange) {
    currentStatusChange.timeTaken = currentStatusChange.endTime - currentStatusChange.startTime;
    statusChanges.push({ ...currentStatusChange });
  }



  let position = null;

  const buyInfo = cache.get('buyInfo');

  let savedPosition = cache.get('savedPosition');

  const lastObjects = statusChanges.slice(-4);

  const currentStrPrice = dataStream[dataStream.length - 1].price;

  const tableName = '`market-analysis`.`capital-positions`';

  if (!savedPosition) {
    const newSavedPosition = await sequelize.query(`select * from ${tableName}`, {
      type: QueryTypes.SELECT
    }).catch(err => {console.log(`Error37: ${err}`);});

    cache.put('savedPosition', newSavedPosition);
  }

  if (cache.get('savedPosition').length > 0) {
    position = JSON.parse(cache.get('savedPosition')[0].positionInfo);
  } else {
    position = cache.get('position');
  }
  
  if (!position && !buyInfo) {
 
    if ((lastObjects[0].status === 'Falling Down Fast' && lastObjects[0].timeTaken > 100000) && 
    (lastObjects[1].status === 'Going Up Fast')) {

      //const buyPosition = dummyBuy;

      cache.put('buyInfo', 'Buy 1');

      const buyPosition = await CapitalBuy.createBuyPosition(sessionInfo, epic);

      cache.put('position', buyPosition);

      const positionInfo = await saveBuy({ positionInfo: buyPosition });

    } else if ((lastObjects[0].status === 'Falling Down Fast' && lastObjects[0].timeTaken > 100000) && 
    (lastObjects[1].status === 'Steady')) {

      //const buyPosition = dummyBuy;
  
      cache.put('buyInfo', 'Buy 2');

      const buyPosition = await CapitalBuy.createBuyPosition(sessionInfo, epic);

      cache.put('position', buyPosition);

      const positionInfo = await saveBuy({ positionInfo: buyPosition });

    } else if ((lastObjects[0].status === 'Falling Down Fast' && lastObjects[0].timeTaken > 100000) && 
    (lastObjects[1].status === 'Steady') && (lastObjects[2].status === 'Going Up Fast')) {
  
      //const buyPosition = dummyBuy;

      cache.put('buyInfo', 'Buy 3');

      const buyPosition = await CapitalBuy.createBuyPosition(sessionInfo, epic);

      cache.put('position', buyPosition);

      const positionInfo = await saveBuy({ positionInfo: buyPosition });

    } else if ((lastObjects[0].status === 'Falling Down Fast' && lastObjects[0].timeTaken > 100000) && 
    (lastObjects[1].status === 'Steady') && (lastObjects[2].status === 'Going Up Fast')) {
  
      //const buyPosition = dummyBuy;

      cache.put('buyInfo', 'Buy 4');

      const buyPosition = await CapitalBuy.createBuyPosition(sessionInfo, epic);

      cache.put('position', buyPosition);

      const positionInfo = await saveBuy({ positionInfo: buyPosition });

    } else if ((lastObjects[0].status === 'Falling Down Fast' && lastObjects[0].timeTaken > 100000) && 
    (lastObjects[1].status === 'Falling Down Slowly') && 
    (lastObjects[2].status === 'Steady') && 
    (lastObjects[3].status === 'Going Up Slowly')) {

      //const buyPosition = dummyBuy;
  
      cache.put('buyInfo', 'Buy 5');

      const buyPosition = await CapitalBuy.createBuyPosition(sessionInfo, epic);

      cache.put('position', buyPosition);

      const positionInfo = await saveBuy({ positionInfo: buyPosition });

    } else {
      console.log('No Position Opened.', lastObjects[0]);
    }

  } else {

    if (lastObjects.length > 4 && 
      (position.level + 20) >= currentStrPrice 
      && lastObjects[2].status === 'Falling Down Fast') {
      const closedPosition = await CapitalClose.closePosition(position, sessionInfo);

      const positionInfo = await saveClose({ positionInfo: position });

      const deleted = await deleteBuy();

      cache.put('position', null);
      cache.put('buyInfo', null);
      console.log(position, 'Position Closed');
    } else if (lastObjects.length > 4 && 
      (position.level + 4) >= currentStrPrice && 
      lastObjects[2].status === 'Steady') {
      const closedPosition = await CapitalClose.closePosition(position, sessionInfo);

      const positionInfo = await saveClose({ positionInfo: position });

      const deleted = await deleteBuy();

      cache.put('position', null);
      cache.put('buyInfo', null);
      console.log(position.level, 'Position Closed');
    } else if (lastObjects.length > 4 && 
      (position.level + 4) >= currentStrPrice && 
      lastObjects[2].status === 'Falling Down Slowly') {
      const closedPosition = await CapitalClose.closePosition(position, sessionInfo);

      const positionInfo = await saveClose({ positionInfo: position });

      const deleted = await deleteBuy();

      cache.put('position', null);
      cache.put('buyInfo', null);
      console.log(position, 'Position Closed');
    } else {
      console.log(cache.get('buyInfo'));
      console.log(`dealId: ${position.dealId}`);
      console.log(`target price: ${position.level}`);
    }
    
  }


  return statusChanges;

}

const saveBuy = async (buyPosition) => {
  const positionInfo = await CapitalPosition.create({
    positionInfo: buyPosition,
  })
  .then(positionInfo => { 

      return positionInfo;
  })
  .catch(err => { 
      console.log(err);
      
      return err;
  });

  return positionInfo;
}

const deleteBuy = async () => {

  const tableName = '`market-analysis`.`capital-positions`';

  const response = await sequelize.query(`delete from ${tableName}`, {
    type: QueryTypes.SELECT
  }).catch(err => {console.log(`Error37: ${err}`);});

  return response;
}

const saveClose = async (closedPosition) => {
  const positionInfo = await CapitalClosedPosition.create({
    positionInfo: closedPosition,
  })
  .then(positionInfo => { 

      return positionInfo;
  })
  .catch(err => { 
      console.log(err);
      
      return err;
  });

  return positionInfo;
}