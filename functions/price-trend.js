

// Parameters for analysis
const windowSize = 100; // Adjust this for your desired window size
const priceChangeThreshold = 0.00002; // Adjust this for your desired threshold

// Function to calculate the moving average
function calculateMovingAverage(prices) {
    const sum = prices.reduce((acc, price) => acc + price, 0);
    return sum / prices.length;
}

// Function to analyze the price trend
exports.analyzePriceTrend = (prices) => {
    if (prices.length < windowSize) {
        return "Not enough data";
    }

    // Calculate the moving average for the most recent window of prices
    const currentPrices = prices.slice(-windowSize);
    const currentMovingAverage = calculateMovingAverage(currentPrices);

    // Calculate the moving average for the previous window of prices
    const previousPrices = prices.slice(-windowSize * 2, -windowSize);
    const previousMovingAverage = calculateMovingAverage(previousPrices);

    // Calculate the rate of change
    const rateOfChange = (currentMovingAverage - previousMovingAverage) / previousMovingAverage;
    console.log(rateOfChange)
    if (rateOfChange > priceChangeThreshold) {
        if (rateOfChange > 0.00005) {
            return "Going Up Fast";
        } else {
            return "Going Up Slowly";
        }
    } else if (rateOfChange < -priceChangeThreshold) {
        if (rateOfChange < -0.00005) {
            return "Falling Down Fast";
        } else {
            return "Falling Down Slowly";
        }
    } else {
        return "Steady";
    }
}
