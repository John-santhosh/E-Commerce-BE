import express from "express";
import { UserAuthController } from "@controllers";
import { validateUser } from "@middleware";

const router = express.Router();
const userAuthController = new UserAuthController();

router.post("/login", userAuthController.login);
router.post("/logout", validateUser, userAuthController.logOut);
router.post("/forgetPassword", userAuthController.forgetPassword);
router.post("/confirmEmail", userAuthController.emailVerification);
router.post("/changePassword", userAuthController.changePassword);
router.get("/otpVerify", userAuthController.verifyOTP);

export default router;
