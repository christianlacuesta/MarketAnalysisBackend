const cron = require('node-cron');
const cache = require('memory-cache');


exports.pingStream = (sessionInfo) => {

    cache.put('sessionInfo', sessionInfo);

    cron.schedule('*/9 * * * *', () => {

        const newSessionInfo = cache.get('sessionInfo');

        const myHeaders = new Headers();
    
        myHeaders.append("X-SECURITY-TOKEN", sessionInfo.securityToken);
        myHeaders.append("CST", sessionInfo.cst);
    
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
    
        fetch("https://api-capital.backend-capital.com/api/v1/ping", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    });




}