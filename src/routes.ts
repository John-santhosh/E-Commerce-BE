import { Request, Response, Express } from "express";
import { userController } from "./controllers";

import { router } from "./routes/test";
export const routes = (app: Express) => {
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Hello World!");
  });

  app.post("/create", userController.createUser);
  app.use("/login", () => {});
  app.use("/logout", () => {});
  app.use("/forgetPassword", () => {});
  app.use("/test", router);

  // app.post("/create/:id", userController.createUser);
};
