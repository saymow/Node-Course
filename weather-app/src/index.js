"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var geocode_1 = __importDefault(require("./utils/geocode"));
var forecast_1 = __importDefault(require("./utils/forecast"));
dotenv_1.default.config();
var location = process.argv.slice(2).join(" ");
if (!location)
    console.log("You must provide a location.");
else {
    geocode_1.default(location, function (error, data) {
        if (!data || error)
            return console.log("error: ", error);
        forecast_1.default(data.latitude, data.longitude, function (error, forecastData) {
            if (error)
                return console.log("error: ", error);
            console.log("data: ", __assign(__assign({}, forecastData), data));
        });
    });
}
