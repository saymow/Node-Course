import path from "path";
import dotenv from "dotenv";
import express from "express";
import hbs from "hbs";
dotenv.config();

import routes from "./routes";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "..", "templates", "views"));

hbs.registerPartials(path.join(__dirname, "..", "templates", "partials"));

app.use(routes);

app.listen(port, () => console.log(`Server is running on port ${port}.`));
