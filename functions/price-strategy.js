const CapitalPosition = require('../models/capital-position');
const CapitalSell = require('../functions/capital-sell');
const CapitalBuy = require('../functions/capital-buy');
const CapitalClose = require('../functions/capital.close');
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

  const position = cache.get('position');
  const buyInfo = cache.get('buyInfo');

  const lastObjects = statusChanges.slice(-4);

  const currentStrPrice = dataStream[dataStream.length - 1].price;

  const dummyBuy = {"date":"2023-09-21T06:20:56.874","status":"OPEN","reason":"SUCCESS","dealStatus":"ACCEPTED","epic":"BTCUSD","dealReference":"o_f812d363-2d29-4655-8e65-6714292ceddc","dealId":"000940dd-0001-54c4-0000-000083039cb8","affectedDeals":[{"dealId":"000940dd-0001-54c4-0000-000083039cb9","status":"OPENED"}],"level":27074.25,"size":0.01,"direction":"BUY","guaranteedStop":false,"trailingStop":false};

  if (!position && !buyInfo) {
    
    if ((lastObjects[0].status === 'Falling Down Fast' && lastObjects[0].timeTaken > 100000) && 
    (lastObjects[1].status === 'Going Up Fast')) {

      //const buyPosition = dummyBuy;

      cache.put('buyInfo', 'Buy 1');

      const buyPosition = await CapitalBuy.createBuyPosition(sessionInfo, epic);

      cache.put('position', buyPosition);

      const positionInfo = await CapitalPosition.create({
        positionInfo: buyPosition,
      })
      .then(positionInfo => { 

          return positionInfo;
      })
      .catch(err => { 
          console.log(err) 
      });
    } else if ((lastObjects[0].status === 'Falling Down Fast' && lastObjects[0].timeTaken > 100000) && 
    (lastObjects[1].status === 'Steady')) {

      //const buyPosition = dummyBuy;
  
      cache.put('buyInfo', 'Buy 2');

      const buyPosition = await CapitalBuy.createBuyPosition(sessionInfo, epic);

      cache.put('position', buyPosition);

      const positionInfo = await CapitalPosition.create({
        positionInfo: buyPosition,
      })
      .then(positionInfo => { 

          return positionInfo;
      })
      .catch(err => { 
          console.log(err) 
      });
    } else if ((lastObjects[0].status === 'Falling Down Fast' && lastObjects[0].timeTaken > 100000) && 
    (lastObjects[1].status === 'Steady') && (lastObjects[2].status === 'Going Up Fast')) {
  
      //const buyPosition = dummyBuy;

      cache.put('buyInfo', 'Buy 3');

      const buyPosition = await CapitalBuy.createBuyPosition(sessionInfo, epic);

      cache.put('position', buyPosition);

    } else if ((lastObjects[0].status === 'Falling Down Fast' && lastObjects[0].timeTaken > 100000) && 
    (lastObjects[1].status === 'Steady') && (lastObjects[2].status === 'Going Up Fast')) {
  
      //const buyPosition = dummyBuy;

      cache.put('buyInfo', 'Buy 4');

      const buyPosition = await CapitalBuy.createBuyPosition(sessionInfo, epic);

      cache.put('position', buyPosition);

      const positionInfo = await CapitalPosition.create({
        positionInfo: buyPosition,
      })
      .then(positionInfo => { 

          return positionInfo;
      })
      .catch(err => { 
          console.log(err) 
      });

    } else if ((lastObjects[0].status === 'Falling Down Fast' && lastObjects[0].timeTaken > 100000) && 
    (lastObjects[1].status === 'Falling Down Slowly') && 
    (lastObjects[2].status === 'Steady') && 
    (lastObjects[3].status === 'Going Up Slowly')) {

      //const buyPosition = dummyBuy;
  
      cache.put('buyInfo', 'Buy 5');

      const buyPosition = await CapitalBuy.createBuyPosition(sessionInfo, epic);

      cache.put('position', buyPosition);

      const positionInfo = await CapitalPosition.create({
        positionInfo: buyPosition,
      })
      .then(positionInfo => { 

          return positionInfo;
      })
      .catch(err => { 
          console.log(err) 
      });
    } else {
      console.log('No Position Opened.', lastObjects[0]);
    }

  } else {

    if ((position + 20) >= currentStrPrice && lastObjects[2].status === 'Falling Down Fast') {
      const closedPosition = await CapitalClose.closePosition(position, sessionInfo);
      cache.put('position', null);
      cache.put('buyInfo', null);
      console.log(position, 'Position Closed');
    } else if ((position + 2) >= currentStrPrice && lastObjects[2].status === 'Steady') {
      const closedPosition = await CapitalClose.closePosition(position, sessionInfo);
      cache.put('position', null);
      cache.put('buyInfo', null);
      console.log(position, 'Position Closed');
    } else if ((position + 2) >= currentStrPrice && lastObjects[2].status === 'Falling Down Slowly') {
      const closedPosition = await CapitalClose.closePosition(position, sessionInfo);
      cache.put('position', null);
      cache.put('buyInfo', null);
      console.log(position, 'Position Closed');
    } else {
      console.log(cache.get('buyInfo'))
      console.log(`dealId: ${position}`)
    }
    
  }


  return statusChanges;

}