import express from "express";
import { UserController } from "@controllers";

const router = express.Router();
const userController = new UserController();

router.route("/").post(userController.createUser);

export default router;
