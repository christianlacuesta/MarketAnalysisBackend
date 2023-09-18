

exports.findSupportLevels = (dataStream, timePeriod, minTests) => {
  const supports = new Map(); // Map to store support levels and their test counts

  for (let i = 0; i < dataStream.length; i++) {
    const currentData = dataStream[i];
    const currentTime = currentData.time;
    const currentPrice = currentData.price;

    // Filter data points within the specified time period
    const relevantData = dataStream.slice(0, i).filter((dataPoint) => {
      return currentTime - dataPoint.time <= timePeriod;
    });

    // Count how many times the current price has been tested as support within the time period
    const testCount = relevantData.reduce((count, dataPoint) => {
      return dataPoint.price <= currentPrice ? count + 1 : count;
    }, 0);

    // If the test count meets the minimum required tests, add it to the supports list
    if (testCount >= minTests) {
      supports.set(currentPrice, {
        price: currentPrice,
        time: currentTime,
        testCount: testCount,
      });
    }
  }

  // Convert the Map to an array of support levels
    const supportLevels = Array.from(supports.values());

    return supportLevels;
  }
  
