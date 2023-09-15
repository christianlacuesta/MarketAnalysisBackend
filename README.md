# MarketAnalysisBackend
Node.js Stock Market Quant for Capital.com API live data stream

1. Server will run on port 8190 and default MySql database configuration is stored on helpers.js
2. To create a session in capital.com
   2a. a post command should be sent to http://localhost:8190/api/session/session/create-session
   2b. json payload should be attached on the post command containing:
   {
     "apiKey": "yourApiKey",
     "email": "yourEmail",
     "password": "yourPassword",
     "encryptedPassword": false
   }
 3. Once a session is created it would be stored on a MySql table under capital-session-logs
 4. To start to run the stock live stream a post command should be sent to: http://localhost:8190/api/live-stream/live-stream/get-data
    4a. json payload should be attached on the post command containing the ticker of the stock ei BITCOIN "BTCUSD" or TESLA "TSLA":
    {
     "epic": "epic",
    }
