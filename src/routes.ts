import { Request, Response, Express } from "express";
import { userController } from "./controllers";

export const routes = (app: Express) => {
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  app.post("/create", userController.createUser);
  app.post("/create/:id", userController.createUser);
};
