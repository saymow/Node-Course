import dotenv from "dotenv";
import geocode from "./utils/geocode";
import forecast from "./utils/forecast";
dotenv.config();

const location = process.argv.slice(2).join(" ");

if (!location) console.log("You must provide a location.");
else {
  geocode(location, (error, data) => {
    if (!data || error) return console.log("error: ", error);
    forecast(
      data.latitude,
      data.longitude,
      (error: string, forecastData: {}) => {
        if (error) return console.log("error: ", error);
        console.log("data: ", {
          ...forecastData,
          ...data,
        });
      }
    );
  });
}
