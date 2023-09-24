

exports.volumeAnalysis = async (data) => {
    if (!data || data.length === 0) {
        console.log("No data available.");
        return;
      }
    
      // Calculate the sum of lastTradedVolume values
      const totalVolume = data.reduce((acc, snapshot) => acc + snapshot.lastTradedVolume, 0);
    
      // Calculate the average volume
      const averageVolume = totalVolume / data.length;
    
      // Get the last volume in the array
      const lastVolume = data[data.length - 1].lastTradedVolume;
    
      console.log("Average Volume:", averageVolume);
      console.log("Last Volume:", lastVolume);
    
      // Compare the last volume to the average
      if (lastVolume > averageVolume) {
        console.log("Last volume is above average.");
      } else {
        console.log("Last volume is not above average.");
      }
}