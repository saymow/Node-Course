"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var geocode = function (address, cb) {
    var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=" + process.env.GEO_ACCESS_KEY + "&limit=1";
    axios_1.default
        .get(url)
        .then(function (_a) {
        var data = _a.data;
        try {
            if (data.features.length === 0)
                throw "Unable to find location";
            var _b = data.features[0].center, longitude = _b[0], latitude = _b[1];
            var location_1 = data.features[0].place_name;
            cb(undefined, {
                latitude: latitude,
                longitude: longitude,
                location: location_1,
            });
        }
        catch (err) {
            cb(err, undefined);
        }
    })
        .catch(function (err) { return cb("Connection error", undefined); });
};
exports.default = geocode;
