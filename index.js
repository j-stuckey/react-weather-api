const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors({ origin: '*' }));

app.get('/api/weather', (req, res) => {
    const { location } = req.query;

    res.json({ message: 'OK' });
});

const server = app.listen((port = 8080), () => {
    console.info(`App listening on port ${server.address().port}`);
});
