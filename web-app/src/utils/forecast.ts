import axios from "axios";

type foreCastCb = (error?: string, data?: string) => void;

const forecast = (latitude: number, longitude: number, cb: foreCastCb) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_ACCESS_KEY}&query=${latitude},${longitude}`;
  axios
    .get(url)
    .then(({ data }) => {
      try {
        if (data.error) throw "Unable to find location";
        if (data.current.weather_descriptions.length === 0)
          throw "Unable to find location. Try another search.";
        const [description] = data.current.weather_descriptions;
        const { temperature, feelslike } = data.current;
        cb(
          undefined,
          `The weather is currently ${description}. It's ${temperature}° out. but it feels like ${feelslike}°.`
        );
      } catch (err) {
        cb(err, undefined);
      }
    })
    .catch((err) => cb("Unable to connection to weather service.", undefined));
};

export default forecast;
