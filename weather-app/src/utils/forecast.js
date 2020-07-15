"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var forecast = function (latitude, longitude, cb) {
    var url = "http://api.weatherstack.com/current?access_key=" + process.env.WEATHER_ACCESS_KEY + "&query=" + latitude + "," + longitude;
    axios_1.default
        .get(url)
        .then(function (_a) {
        var data = _a.data;
        try {
            if (data.error)
                throw "Unable to find location";
            if (data.current.weather_descriptions.length === 0)
                throw "Unable to find location. Try another search.";
            var descriptions = data.current.weather_descriptions[0];
            var _b = data.current, temperature = _b.temperature, feelslike = _b.feelslike;
            cb(undefined, {
                descriptions: descriptions,
                temperature: temperature,
                feelslike: feelslike,
            });
        }
        catch (err) {
            cb(err, undefined);
        }
    })
        .catch(function (err) { return cb("Unable to connection to weather service.", undefined); });
};
exports.default = forecast;
