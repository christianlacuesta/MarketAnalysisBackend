exports.calculateMACD = (data, shortTermPeriod = 12, longTermPeriod = 26, signalPeriod = 9) => {
    if (!data || data.length === 0) {
      console.log("No data available.");
      return;
    }
  
    if (data.length <= longTermPeriod) {
      console.log("Not enough data points to calculate MACD.");
      return;
    }
  
    const closePrices = data.map((snapshot) => snapshot.closePrice.bid); // Use bid prices
  
    const shortTermEMA = [];
    const longTermEMA = [];
    const macdLine = [];
    const signalLine = [];
  
    for (let i = 0; i < closePrices.length; i++) {
      if (i >= longTermPeriod - 1) {
        // Calculate short-term and long-term EMAs
        const shortTermSlice = closePrices.slice(i - shortTermPeriod + 1, i + 1);
        const longTermSlice = closePrices.slice(i - longTermPeriod + 1, i + 1);
        const shortTermEMAValue = calculateEMA(shortTermSlice, shortTermPeriod);
        const longTermEMAValue = calculateEMA(longTermSlice, longTermPeriod);
  
        shortTermEMA.push(shortTermEMAValue);
        longTermEMA.push(longTermEMAValue);
  
        // Calculate MACD line
        const macdValue = shortTermEMAValue - longTermEMAValue;
        macdLine.push(macdValue);
      }
    }
  
    // Calculate signal line using EMA of MACD line

    signalLine.push(...[calculateEMA(macdLine.slice(0, signalPeriod), signalPeriod)]);
    for (let i = signalPeriod; i < macdLine.length; i++) {
      const signalValue = calculateEMA([macdLine[i]], signalPeriod);
      signalLine.push(signalValue);
    }
  
    return {
      shortTermEMA,
      longTermEMA,
      macdLine,
      signalLine,
    };
  }
  
  function calculateEMA(data, period) {
    if (data.length < period) {
      return null;
    }
  
    const multiplier = 2 / (period + 1);
    let ema = data.slice(0, period).reduce((acc, val) => acc + val, 0) / period;
  
    for (let i = period; i < data.length; i++) {
      ema = (data[i] - ema) * multiplier + ema;
    }
  
    return ema;
  }