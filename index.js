'use strict';

require('rootpath')();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('middleware/logger');

const { getWeather, getDarkSkyData } = require('middleware/fetchData');

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(helmet());

// wraps morgan with winston logger
app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
        stream: logger.stream
    })
);

const MINUTE = 60 * 1000;
const PROD_REQUEST_LIMIT = 5;
const DEV_REQUEST_LIMIT = 40;

const limiter = rateLimit({
    windowMs: MINUTE * 60,
    max: process.env.NODE_ENV === 'production'
            ? PROD_REQUEST_LIMIT
            : DEV_REQUEST_LIMIT
});

app.use('/api', limiter);

app.get('/status', (req, res, next) => {
    res.status(200).send('Server running');
});

app.get('/api/weather', getWeather, (req, res) => {
    const { darkskyData, address } = res.locals;

    const { currently, daily, hourly, minutely } = darkskyData;

    res.json({ address, currently, daily, hourly, forecast: darkskyData });
});

app.get('/api/forecast', getDarkSkyData, (req, res, next) => {
    const { darkskyData, address } = res.locals;

    const { currently, daily, hourly, minutely } = darkskyData;

    res.json({ address, currently, daily, hourly, forecast: darkskyData });
});

app.use((req, res, next) => {
    next({ status: 404, message: "Sorry can't find that!" });
});

app.use((err, req, res, next) => {
    console.log({ err });
    if (err.status) {
        logger.error(err);
        res.status(err.status).json(err);
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

function runServer(port = 8080) {
    const server = app.listen(port, () => {
        console.info(`App listening on port ${server.address().port}`);
    });
}

runServer();
