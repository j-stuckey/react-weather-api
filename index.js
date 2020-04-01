'use strict';

require('rootpath')();
const express = require('express');
const cors = require('cors');
const redis = require('redis');
const helmet = require('helmet');
const flatten = require('flat');
const unflatten = flatten.unflatten;
const morgan = require('morgan');

const { getLatLong, checkIfDataExists } = require('middleware/fetchData');

const app = express();

const redisClient = redis.createClient();

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(helmet());

app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'));

app.get('/api/weather', checkIfDataExists, getLatLong, (req, res) => {
    const { location } = req.query;
    // const { darkskyData } = res.locals;
    //
    // const flattenedData = flatten(darkskyData);
    //
    // redisClient.hmset(location, flattenedData, redis.print);
    // res.json({ data: res.locals });
    res.json({ status: 'OK' });
});

function runServer(port = 8080) {
    const server = app.listen(port, () => {
        console.info(`App listening on port ${server.address().port}`);
    });

    redisClient.on('connect', () => {
        console.info('Redis client connected');
    });
}

runServer();
