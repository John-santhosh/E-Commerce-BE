import { Request, Response, Express } from "express";
import { userAuthRoutes, userRoutes } from "@routes";

export const routes = (app: Express) => {
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Hello World!");
  });

  app.use("/create", userRoutes);
  app.use("/auth", userAuthRoutes);
};
