"use strict";

require("rootpath")();
const express = require("express");
const cors = require("cors");
const redis = require("redis");
const axios = require("axios");
const flatten = require("flat");
const unflatten = flatten.unflatten;

const { getLatLong } = require("middleware/fetchData");

const app = express();
const redisClient = redis.createClient();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/api/weather", getLatLong, (req, res) => {
    const { location } = req.query;
    const { darkskyData } = res.locals;

    const flattenedData = flatten(darkskyData);

    redisClient.hmset(location, flattenedData, redis.print);
    res.json({ data: res.locals });
});

async function runServer(port = 8080) {
    const server = app.listen(port, () => {
        console.info(`App listening on port ${server.address().port}`);
    });

    redisClient.on("connect", () => {
        console.info("Redis client connected");
    });

    redisClient.hgetall("Linden", function(err, res) {
        console.log(unflatten(res));
    });
}

runServer();
