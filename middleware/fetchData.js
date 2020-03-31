const axios = require("axios");
const moment = require("moment");
const redis = require("redis");
const flatten = require("flat");
const client = redis.createClient();
const { promisify } = require("util");
const hgetAsync = promisify(client.hgetall).bind(client);

const { GOOGLE_API_KEY, DARKSKY_API_KEY } = require("config");

const checkIfDataExists = async (req, res, next) => {
    const { location } = req.query;

    const locationData = await hgetAsync(location);
    if (!locationData) {
        // Save into redis here
        console.log(`${location} hasn't been saved`);
    } else {
        console.log(location);
        res.json({ data: flatten.unflatten(locationData) });
    }
    next();
};

const getLatLong = async (req, res, next) => {
    const { location } = req.query;

    // const response = await axios.get(
    //     `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GOOGLE_API_KEY}`
    // );
    //
    // const data = response.data;
    //
    // const address = data.results[0].formatted_address;
    //
    // const { lat, lng } = data.results[0].geometry.location;
    //
    // const addressInfo = {
    //     address,
    //     lat,
    //     long: lng
    // };
    //
    // const darkskyResponse = await getDarkskyForecast(lat, lng);
    // const darkskyData = darkskyResponse.data;
    //
    // res.locals.address = address
    // res.locals.darkskyData = darkskyData;
    next();
};

async function getDarkskyForecast(latitude, longitude) {
    const response = await axios(
        `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${latitude},${longitude}`
    );

    return response;
}

module.exports = { getLatLong, checkIfDataExists };
