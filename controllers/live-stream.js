const WebSocket = require('ws');
const sequelize = require('../helpers/database');
const { Op, Sequelize } = require("sequelize");
const { QueryTypes } = require('sequelize');

const streamUrl = 'wss://api-streaming-capital.backend-capital.com/connect';
const ws = new WebSocket(streamUrl);

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

    ws.on('open', () => {
        console.log('Connected to Capital.com data stream');
        
    });
    
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        console.log('Received data:', message);
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