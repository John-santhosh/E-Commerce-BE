import express from "express";
import { UserAuthController } from "../controllers/userAuthController";

const router = express.Router();
const userAuthController = new UserAuthController();

router.post("/login", userAuthController.verifyOTP);
router.post("/logout", userAuthController.logOut);
router.post("/forgetPassword", userAuthController.forgetPassword);
router.post("/confirmEmail", userAuthController.emailVerification);
router.post("/otpVerify", userAuthController.verifyOTP);

export default router;