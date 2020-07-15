import axios from "axios";

type CallBack = (arg0: string | undefined, arg1: Data | undefined) => void;

interface Data {
  latitude: number;
  longitude: number;
  location: string;
}

const geocode = (address: string, cb: CallBack) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${process.env.GEO_ACCESS_KEY}&limit=1`;

  axios
    .get(url)
    .then(({ data }) => {
      try {
        if (data.features.length === 0) throw "Unable to find location";
        const [longitude, latitude] = data.features[0].center;
        const location = data.features[0].place_name;

        cb(undefined, {
          latitude,
          longitude,
          location,
        });
      } catch (err) {
        cb(err, undefined);
      }
    })
    .catch((err) => cb("Connection error", undefined));
};

export default geocode;
