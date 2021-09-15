'use strict';

const app = require('./src/config/app');

app.listen(process.env.PORT || 3001, function () {
    console.log('Start server');
    console.log('Service is running');
});