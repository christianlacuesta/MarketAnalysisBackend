

exports.simulateTrading = (dataStream, supportLevels, resistanceLevels) => {

  // Function to check if it's time to make a decision (every 5 minutes)
  function isDecisionTime(currentTime, lastDecisionTime) {
    return currentTime - lastDecisionTime >= 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  // Function to make a buy, sell, or hold decision
  function makeDecision(price, supportLevels, resistanceLevels, lastDecisionTime, lastDecisionPrice, currentPosition) {
    const currentTime = Date.now();

    // Check if it's time to make a decision
    if (!isDecisionTime(currentTime, lastDecisionTime)) {
      return "Hold"; // Hold position and do not make a decision
    }

    // Determine if a buy or sell decision should be made based on price and position
    let decision = null;

    for (const support of supportLevels) {
      if (decision && price >= support.price && price - 100 <= decision.price) {
        if (currentPosition !== "Buy") {
          decision = { action: "Buy", price: price, level: support.price, time: currentTime };
          break;
        }
      }
    }

    for (const resistance of resistanceLevels) {
      if (decision && price <= resistance.price && price + 100 >= decision.price) {
        if (currentPosition !== "Sell") {
          decision = { action: "Sell", price: price, level: resistance.price, time: currentTime };
          break;
        }
      }
    }

    // Update the last decision time and price if a decision was made
    if (decision) {
      lastDecisionTime = currentTime;
      lastDecisionPrice = decision.price;
      currentPosition = decision.action;
      console.log(`Decision: ${decision.action} at Price: ${decision.price} based on Level: ${decision.level}`);
    } else {
      console.log("Decision: Hold"); // No buy or sell decision made
    }

    return { lastDecisionTime, lastDecisionPrice, currentPosition };
  }

  // Example usage:
  let lastDecisionTime = 0; // Initialize the last decision time
  let lastDecisionPrice = null; // Initialize the last decision price (null means no previous decision)
  let currentPosition = null; // Initialize the current position (null means no position)

  // Simulate a data stream with price changes

    const price = supportLevels.map((data) => data.price);

    const decisionResult = makeDecision(price[price.length - 1], supportLevels, resistanceLevels, lastDecisionTime, lastDecisionPrice, currentPosition);
    if (decisionResult) {
      lastDecisionTime = decisionResult.lastDecisionTime;
      lastDecisionPrice = decisionResult.lastDecisionPrice;
      currentPosition = decisionResult.currentPosition;
    }

    return decisionResult
  }