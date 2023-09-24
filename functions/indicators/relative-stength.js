exports.calculateRSI = (data, period = 14) => {
    if (!data || data.length === 0) {
      console.log("No data available.");
      return;
    }
  
    if (data.length <= period) {
      console.log("Not enough data points to calculate RSI.");
      return;
    }
  
    const priceChanges = [];
    const gains = [];
    const losses = [];
  
    // Calculate price changes and separate gains and losses
    for (let i = 1; i < data.length; i++) {
      const closePriceCurr = data[i].closePrice.bid; // You can choose bid or ask price here
      const closePricePrev = data[i - 1].closePrice.bid; // You can choose bid or ask price here
      const priceChange = closePriceCurr - closePricePrev;
      priceChanges.push(priceChange);
  
      if (priceChange >= 0) {
        gains.push(priceChange);
        losses.push(0);
      } else {
        gains.push(0);
        losses.push(Math.abs(priceChange));
      }
    }
  
    // Calculate average gains and losses over the specified period
    let avgGain = gains.slice(0, period).reduce((acc, val) => acc + val, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((acc, val) => acc + val, 0) / period;
  
    const rsArray = [];
    const rsiArray = [];
  
    // Calculate RSI values
    for (let i = period; i < priceChanges.length; i++) {
      const gain = gains[i];
      const loss = losses[i];
  
      avgGain = ((avgGain * (period - 1)) + gain) / period;
      avgLoss = ((avgLoss * (period - 1)) + loss) / period;
  
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
  
      rsArray.push(rs);
      rsiArray.push(rsi);
    }
  
    return rsiArray;
  }