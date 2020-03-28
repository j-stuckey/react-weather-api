const express = require('express');

const app = express();

const server = app.listen(port = 8080, () => {
    console.info(`App listening on port ${server.address().port}`)
});
