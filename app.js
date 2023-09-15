const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./helpers/database');

const sessionRoutes = require('./routes/session');
const liveStreamRoutes = require('./routes/live-stream');

// const fileRoutes = require('./routes/upload');  

const app = express();

app.use(express.static(path.join(__dirname, 'files')));

app.use('/files', express.static(__dirname + '/files'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
    next();
});

app.use('/api/session', sessionRoutes);
app.use('/api/live-stream', liveStreamRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

sequelize.sync().then(result => {
    app.listen(8190);
})
.catch(err => {
    console.log(err);
});
  