const WebSocket = require('ws');
const sequelize = require('../helpers/database');
const { QueryTypes } = require('sequelize');
const priceTrend = require('../functions/price-trend');

const streamUrl = 'wss://api-streaming-capital.backend-capital.com/connect';
const ws = new WebSocket(streamUrl);

const priceStream = [];

exports.getLiveMarketData = async (req, res, next) => {

    const tableName = '`market-analysis`.`capital-session-logs`';

    const response = await sequelize.query(`select * from ${tableName}  ORDER BY sessionId DESC LIMIT 1`, {
        type: QueryTypes.SELECT
    }).catch(err => {console.log(err);});


    // Create the subscription payload
    const subscriptionPayload = {
        destination: 'marketData.subscribe',
        correlationId: '1',
        cst: response[0].sessionInfo.sessionInfo.cst,
        securityToken: response[0].sessionInfo.sessionInfo.securityToken,
        payload: {
            epics: [req.body.epic]
        }
    };

    // Send the subscription payload as JSON
    await ws.send(JSON.stringify(subscriptionPayload));
    console.log('xx')
    ws.on('open', () => {
        console.log('Connected to Capital.com data stream');
        
    });
    
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        priceStream.push(message.payload.bid);
        const trend = priceTrend.analyzePriceTrend(priceStream);
        console.log(`Price Trend: ${trend} - ${message.payload.bid}`);
        //console.log('Received data:', message);
        // Process the received data here
    });
    
    ws.on('close', () => {
        console.log('Connection closed');
        // Implement reconnection logic here if needed
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    res.status(200).json('Stream Started...');

}