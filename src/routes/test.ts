import { Request, Response } from "express";
import express from "express";
import { UserAuthController } from "../controllers/userAuthController";
import { request } from "http";

export const router = express.Router();

// const userAuthController = new UserAuthController();
router.route("/").get((request: Request, response: Response) => {
  response.status(200).send({ test: "seccess" });
});
router.route("/123").get((request: Request, response: Response) => {
  response.status(200).send({ test: "1234" });
});
// router.route('/')

// export default router;
