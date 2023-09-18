

exports.findResistanceLevels = (dataStream, timePeriod, minTests) => {
  const resistances = new Map(); // Map to store resistance levels and their test counts

  for (let i = 0; i < dataStream.length; i++) {
    const currentData = dataStream[i];
    const currentTime = currentData.time;
    const currentPrice = currentData.price;

    // Filter data points within the specified time period
    const relevantData = dataStream.slice(0, i).filter((dataPoint) => {
      return currentTime - dataPoint.time <= timePeriod;
    });

    // Count how many times the current price has been tested as resistance within the time period
    const testCount = relevantData.reduce((count, dataPoint) => {
      return dataPoint.price >= currentPrice ? count + 1 : count;
    }, 0);

    // If the test count meets the minimum required tests, add it to the resistances list
    if (testCount >= minTests) {
      resistances.set(currentPrice, {
        price: currentPrice,
        time: currentTime,
        testCount: testCount,
      });
    }
  }

  // Convert the Map to an array of resistance levels
  const resistanceLevels = Array.from(resistances.values());
  const priceArray = resistanceLevels.map((data) => data.price);
  return resistanceLevels;
}