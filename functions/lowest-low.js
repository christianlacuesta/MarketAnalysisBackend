
exports.getLowestLow = (dataStream) => {
    let lowestLow = null;
    let intervalStart = null;
  
    const result = [];
  
    dataStream.forEach((dataPoint) => {
      const { price, time } = dataPoint;
  
      if (!intervalStart) {
        // Initialize the interval start time
        intervalStart = time;
        lowestLow = price;
      }
  
      if (time - intervalStart >= 15 * 60 * 1000) { // 15 minutes in milliseconds
        // Save the lowest low for the completed 15-minute interval
        result.push({ time: intervalStart, lowestLow });
  
        // Reset for the next 15-minute interval
        intervalStart = time;
        lowestLow = price;
      } else {
        // Update the lowest low if necessary
        if (price < lowestLow) {
          lowestLow = price;
        }
      }
    });
  
    // Add the last interval if it's incomplete
    if (intervalStart) {
      result.push({ time: intervalStart, lowestLow });
    }
  
    return result;
  }