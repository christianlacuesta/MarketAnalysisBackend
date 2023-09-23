
const CapitalSession = require('../models/capital-session-log');
const PingStream = require('../functions/ping-stream');
const baseUrlLive = 'https://api-capital.backend-capital.com/';
const baseUrlDemo = 'https://demo-api-capital.backend-capital.com/';
const sessionUrl = 'https://api-capital.backend-capital.com/api/v1/session';
const cache = require('memory-cache');

  const reqBody = {
    body: {
      apiKey: null,
      email: null,
      password: null,
    }
  }

  exports.sessionCredentials = async () => {
    return reqBody
  }

  exports.createNewSession = async (req, res, next) => {

    const cacheReqBody = cache.get('reqBody');

    reqBody.body.apiKey = req.body.apiKey;
    reqBody.body.email = req.body.email;
    reqBody.body.password = req.body.password;

    if (!cacheReqBody) {
      cache.put('reqBody', reqBody);
    }

    const defaultParams = {
        apiKey: req.body.apiKey,
        email: req.body.email,
        password: req.body.password
      };

      let raw = JSON.stringify({
        "identifier": defaultParams.email,
        "password": defaultParams.password
      });
  
      let requestOptions = {
        method: 'POST',
        headers: {
          "X-CAP-API-KEY": defaultParams.apiKey,
          "Content-Type": "application/json"
        },
        body: raw,
        redirect: 'follow'
      };
      
      const responseHeaders = await fetch(sessionUrl, requestOptions).then(response => response.headers).catch(error => error);

      let sessionInfo = {
          cst: null,
          securityToken: null
      }

      if(responseHeaders.keys && responseHeaders.keys.length === 0) {
          for (const value of responseHeaders.keys()) {
            if (value === 'cst') {
                sessionInfo.cst = responseHeaders.get(value);
            }
    
            if (value === 'x-security-token') {
                sessionInfo.securityToken = responseHeaders.get(value);
            }
        }

        // Service Pinger to keep connection alive

        PingStream.pingStream(sessionInfo);

        try {

          const session = await fetch(sessionUrl, requestOptions)
          .then(response => response.text())
          .then(result => {return result})
          .catch(error => {
            
            return `error82: ${error}`;
        
          });

          if (session) {
            const sessionCopy = Object.assign(JSON.parse(session), {sessionInfo: sessionInfo});
            if (sessionCopy.errorCode) {
              if (res && res.status) {
                res.status(200).json(sessionCopy.errorCode);
              } else {               
                return sessionCopy.errorCode;
              }
            } else {
              const sessionInfo = await CapitalSession.create({
                sessionInfo: sessionCopy,
              })
              .then(sessionInfo => { 
                if (res && res.status) {
                  res.status(201).json({
                    message: 'Post Success',
                    post: sessionInfo
                  });
                  return sessionInfo;
                } else {
                  return sessionInfo;
                }
              })
              .catch(err => { 
                  console.log(err) 
              });
              return sessionInfo;
            }

          } else {

            res.status(200).json('Error');
     
            return `error126: error`;
          }


        } catch(err) {

          console.log(`Error: ${err}`)

          console.log('error129: reconnecting...');

          const newCacheReqBody = cache.get('reqBody');
          console.log(newCacheReqBody)
          this.createNewSession(cacheReqBody);

        }

      } else {

        return 'error144';

      }
  

  }