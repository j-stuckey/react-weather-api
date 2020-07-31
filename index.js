'use strict';

require('rootpath')();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { getWeather } = require('middleware/fetchData');

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(helmet());

app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'));

app.get('/api/weather', getWeather, (req, res) => {
    const { darkskyData, address } = res.locals;

    const { currently, daily, hourly, minutely } = darkskyData;

    res.json({ address, currently, daily, hourly, forecast: darkskyData });
});

app.use((err, req, res, next) => {
    console.log(err);
    if (err.status) {
        const errBody = Object.assign({}, err, { message: err.message });
        // logger.error(err.message);
        return res.status(err.status).json(errBody);
    }
    if (err.message) {
        res.json({ err: err.message });
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
