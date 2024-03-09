import express from "express";
import { UserAuthController } from "@controllers";

const router = express.Router();
const userAuthController = new UserAuthController();

router.post("/login", userAuthController.login);
router.post("/logout", userAuthController.logOut);
router.post("/forgetPassword", userAuthController.forgetPassword);
router.post("/confirmEmail", userAuthController.emailVerification);
router.get("/otpVerify", userAuthController.verifyOTP);

export default router;
