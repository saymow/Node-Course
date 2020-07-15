import axios from "axios";

const forecast = (latitude: number, longitude: number, cb: Function) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_ACCESS_KEY}&query=${latitude},${longitude}`;
  axios
    .get(url)
    .then(({ data }) => {
      try {
        if (data.error) throw "Unable to find location";
        if (data.current.weather_descriptions.length === 0)
          throw "Unable to find location. Try another search.";
        const [descriptions] = data.current.weather_descriptions;
        const { temperature, feelslike } = data.current;
        cb(undefined, {
          descriptions,
          temperature,
          feelslike,
        });
      } catch (err) {
        cb(err, undefined);
      }
    })
    .catch((err) => cb("Unable to connection to weather service.", undefined));
};

export default forecast;
