

exports.getHighestHigh = (data) => {
    if (data.length === 0) {
      return "No data available.";
    }
  
    // Sort the data by timestamp in ascending order
    data.sort((a, b) => a.time - b.time);
  
    let highestHigh = data[0].price; // Initialize with the first price
    let currentHigh = data[0].price;
    let currentTime = data[0].time;
  
    const result = [];
  
    for (let i = 1; i < data.length; i++) {
      const currentData = data[i];
  
      if (currentData.time - currentTime >= 900000) { // 15 minutes in milliseconds
        // Save the highest high for the past 15 minutes
        result.push({ time: currentTime, highestHigh });
  
        // Reset for the next 15-minute interval
        currentTime = currentData.time;
        highestHigh = currentData.price;
        currentHigh = currentData.price;
      } else {
        if (currentData.price > currentHigh) {
          currentHigh = currentData.price;
        }
      }
    }
  
    // Add the last interval if it's incomplete
    result.push({ time: currentTime, highestHigh });
  
    return result;
  }