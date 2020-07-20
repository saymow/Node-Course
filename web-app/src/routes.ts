import path from "path";
import express from "express";

import geoApi from "./utils/geocode";
import forecastApi from "./utils/forecast";

const routes = express.Router();

routes.use(express.static(path.join(__dirname, "..", "public")));

routes.get("", (req, res) => {
  res.render("index", {
    title: "Weather page using hbs.",
    description: "Some description to test it.",
    name: "Gustavo Alves",
  });
});

routes.get("/about", (req, res) => {
  res.render("about", {
    title: "About page using hbs.",
    description: "some description to fill up this field.",
    name: "Gustavo Alves",
  });
});

routes.get("/help", (req, res) => {
  res.render("help", {
    title: "Help page using hbs",
    description: "Some description to fill this field up.",
    name: "Gustavo Alves",
  });
});

routes.get("/weather", (req, res) => {
  const { address } = req.query;

  if (!address)
    return res.send({
      error: "Address query param must be provided.",
    });

  geoApi(String(address), (error, data) => {
    if (!data || error) return res.send({ error });

    const { latitude, longitude, location } = data;

    forecastApi(latitude, longitude, (error, data) => {
      if (!data || error) return res.send({ error });

      res.send({
        data,
        location,
      });
    });
  });
});

routes.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    description: "Some description to fill this field up.",
    name: "Gustavo Alves",
    error: "Help article not found",
  });
});

routes.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    description: "Some description to fill this field up.",
    name: "Gustavo Alves",
    error: "Page not found",
  });
});

export default routes;
