# MarketAnalysisBackend
Node.js Stock Market Quant for Capital.com API live data stream

1. Server will run on port 8190
2. To create a session in capital.com
   2a. a post command should be sent to http://localhost:8190/api/session/session/create-session
   2b. json payload should be attached on the post command containing:
   {
     "apiKey": "yourApiKey",
     "email": "yourEmail",
     "password": "yourPassword",
     "encryptedPassword": false
   }
