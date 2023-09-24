

exports.supplyAndDemandAnalysis = (data) => {
    if (!data || data.length === 0) {
      console.log("No data available.");
      return;
    }
  
    let totalSupply = 0;
    let totalDemand = 0;
  
    data.forEach((snapshot) => {
      totalSupply += snapshot.highPrice.bid + snapshot.lowPrice.bid;
      totalDemand += snapshot.highPrice.ask + snapshot.lowPrice.ask;
    });
  
    console.log("Total Supply (Highs + Lows):", totalSupply);
    console.log("Total Demand (Highs + Lows):", totalDemand);
  }