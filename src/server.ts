import express from "express";
import { routes } from "./routes";
import bodyParser from "body-parser";

export const createServer = () => {
  const app = express();

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  routes(app);

  return app;
};
