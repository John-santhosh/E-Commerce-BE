import express from "express";
import { router } from "./route";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

export const createServer = () => {
  const app = express();

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  router(app);

  return app;
};

export const prisma = new PrismaClient();
