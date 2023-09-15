
const CapitalSession = require('../models/capital-session');
const baseUrlLive = 'https://api-capital.backend-capital.com/';
const baseUrlDemo = 'https://demo-api-capital.backend-capital.com/';
const sessionUrl = 'https://api-capital.backend-capital.com/api/v1/session';

const reqBody = {
    body: {
      apiKey: null,
      email: null,
      password: null,
    }
  }


  exports.createNewSession = async (req, res, next) => {

    reqBody.body.apiKey = req.body.apiKey;
    reqBody.body.email = req.body.email;
    reqBody.body.password = req.body.password;

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

        try {

          const session = await fetch(sessionUrl, requestOptions)
          .then(response => response.text())
          .then(result => {return result})
          .catch(error => {
            
            return error;
        
        });

          if (session) {
            const sessionCopy = Object.assign(JSON.parse(session), {sessionInfo: sessionInfo});

            if (sessionCopy.errorCode) {

                res.status(200).json(sessionCopy.errorCode);

            } else {

              CapitalSession.create({
                sessionInfo: sessionCopy,
              })
              .then(sessionInfo => { 
                  res.status(201).json({
                      message: 'Post Success',
                      post: sessionInfo
                  });
              })
              .catch(err => { 
                  console.log(err) 
              });

            }


          } else {

            res.status(200).json('Error');

          }


        } catch {

            res.status(200).json('Error');

        }

      } else {

        return null;

      }
  

  }