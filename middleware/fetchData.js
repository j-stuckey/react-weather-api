const axios = require('axios');

const { GOOGLE_API_KEY, DARKSKY_API_KEY } = require('config');

const getWeather = async (req, res, next) => {
    const { location } = req.query;

    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GOOGLE_API_KEY}`
    );

    const data = response.data;
    const address = data.results[0].formatted_address;
    const { lat, lng } = data.results[0].geometry.location;

    const addressInfo = {
        address,
        lat,
        long: lng
    };

    const darkskyResponse = await getDarkskyForecast(lat, lng);
    const darkskyData = darkskyResponse.data;

    res.locals.address = address;
    res.locals.darkskyData = darkskyData;
    next();
};

async function getDarkskyForecast(latitude, longitude) {
    const response = await axios(
        `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${latitude},${longitude}`
    );

    return response;
}

module.exports = { getWeather };
