const WebSocket = require('ws');
const sequelize = require('../helpers/database');
const { QueryTypes } = require('sequelize');
const priceTrend = require('../functions/price-trend');
const sessionController = require('../controllers/session');
const priceStrategy = require('../functions/price-strategy');
const cache = require('memory-cache');

const streamUrl = 'wss://api-streaming-capital.backend-capital.com/connect';
const ws = new WebSocket(streamUrl);

const priceStream = [];
const priceData = [];

// Create the subscription payload
const subscriptionPayload = {
    destination: 'marketData.subscribe',
    correlationId: '1',
    cst: '',
    securityToken: '',
    payload: {
        epics: []
    }
};

exports.getLiveMarketData = async (req, res, next) => {

    const sessionCredentials = await sessionController.sessionCredentials();
    console.log(`session credentials: ${sessionCredentials}`)
    cache.put('reqBody', sessionCredentials);
    cache.put('epic', [req.body.epic]);

    const tableName = '`market-analysis`.`capital-session-logs`';

    const response = await sequelize.query(`select * from ${tableName}  ORDER BY sessionId DESC LIMIT 1`, {
        type: QueryTypes.SELECT
    }).catch(err => {console.log(`Error37: ${err}`);});

    subscriptionPayload.payload.epics = [req.body.epic];
    subscriptionPayload.cst = response[0].sessionInfo.sessionInfo.cst;
    subscriptionPayload.securityToken = response[0].sessionInfo.sessionInfo.securityToken,

    // Send the subscription payload as JSON
    await ws.send(JSON.stringify(subscriptionPayload));
  
    const connectStream = await ws.on('open', () => {
        console.log('Connected to Capital.com data stream');
        return 'Connected to Capital.com data stream';
    });

    ws.on('message', async (data) => {
        const message = JSON.parse(data);
        priceStream.push(message.payload.bid);

        // Process the received data here

        const trend = await priceTrend.analyzePriceTrend(priceStream);

        console.log(`Price Trend: ${trend} - ${message.payload.bid}`);

        const currentPriceStream = {
            price: message.payload.bid,
            status: trend,
            time: message.payload.timestamp
        };

        priceData.push(currentPriceStream);

        const recommendations = await priceStrategy.recommendations(priceData, subscriptionPayload, req.body.epic);
        //console.log('Recommendation:', recommendations);
    });
    
    ws.on('close', async () => {
        console.log('Connection closed');
        // Implement reconnection save priceStream state
     
        const reqBody = cache.get('reqBody');

        const newSession = await sessionController.createNewSession(reqBody);

        const marketData = await this.getLiveMarketData({
            body: {
              epic: cache.get('reqBody')
            }
        });

        if (!marketData) {
            const marketData2 = await this.getLiveMarketData({
                body: {
                  epic: cache.get('reqBody')
                }
            });
        }

        console.log(`market data: ${marketData}`);   
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    if (res && res.status) {
        res.status(200).json('Stream Started...');
    } else {
        console.log('Stream Started...')
        return
    }

}