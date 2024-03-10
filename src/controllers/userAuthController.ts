import { Request, Response } from "express";
import { generateRandomCode, sendResponse, sendSuccess, throwError } from "@helpers";
import { prisma } from "src/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

export class UserAuthController {
  login = async (request: Request, response: Response) => {
    const { email, password } = request?.body;
    if (!email) return sendResponse(404, { error: "Email Required" }, response);
    if (!password) return sendResponse(404, { error: "Password Required" }, response);

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) return sendResponse(401, { error: "User not found" }, response);

    const match = await bcrypt.compare(password, user.password);

    if (!match) return sendResponse(401, { error: "Wrong Password" }, response);

    // const token =
    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    const authToken = jwt.sign({ email, password }, secretKey || "", { expiresIn: "5h" });
    // console.log({ authToken });

    const refToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET || "", { expiresIn: "3d" });

    await prisma.users.update({
      where: { email },
      data: {
        refreshToken: refToken,
      },
    });
    await prisma.user_sessions.create({
      data: {
        authToken: authToken,
        user_id: user.id,
      },
    });
    return response.status(200).send({ email, password, authToken });
  };

  logOut = async (request: Request, response: Response) => {
    const { email } = request?.body;
    if (!email) return sendResponse(403, { error: "Email id required" }, response);

    const { id } = response.locals;
    try {
      await prisma.user_sessions.update({
        where: {
          id,
        },
        data: {
          isLoggedIn: 0,
        },
      });
      return sendSuccess(response);
    } catch (error) {
      console.log(error);
      throwError(response);
    }
  };
  // p
  forgetPassword = async (request: Request, response: Response) => {
    const { email } = request.body;
    if (!email) sendResponse(401, { error: "Email required" }, response);
    const random = generateRandomCode(1e4);
    const token = jwt.sign({ random }, process.env.RESET_TOKEN_SECRET || "", { expiresIn: "15m" });
    console.log({ token });

    try {
      //  @@ TO-DO send mail
      // await sendMail()
      const user = await prisma.users.findUnique({ where: { email } });
      if (!user) return sendResponse(401, { error: "user not found" }, response);
      await prisma.users.update({
        where: {
          email,
        },
        data: {
          resetCode: random,
          resetToken: token,
          isChangePassword: true,
        },
      });
      sendSuccess(response, { msg: "Code sent via email" }, 200);
    } catch (error) {
      console.log(error);
      throwError(response);
    }
  };
  // p
  emailVerification = async (request: Request, response: Response) => {
    try {
      const random = generateRandomCode(1e4);
      const {
        user,
        user: { email },
      } = response.locals;
      // @TODO SEND EMAIL
      if (user.isChangePassword) return sendResponse(403, { error: "Verification failed" }, response);
      await prisma.users.update({ where: { email }, data: { resetCode: random } });
      return sendSuccess(response, { msg: "Verification code sent" });
    } catch (error) {
      return throwError(response);
    }
  };
  confirmEmailVerification = async (request: Request, response: Response) => {
    const { otp } = request.query;
    if (!otp) return sendResponse(400, { error: "OTP required" }, response);
    const { user } = response.locals;
    if (user.isChangePassword) return sendResponse(403, { error: "Verification failed" }, response);

    if (Number(otp) !== user.resetCode) return sendResponse(401, { error: "Invalid otp" }, response);

    try {
      await prisma.users.update({ where: { email: user.email }, data: { resetCode: null, emailVerified: true } });
      return sendSuccess(response, { msg: "Email verified" });
    } catch (error) {
      return throwError(response);
    }
  };
  //g
  verifyOTP = async (request: Request, response: Response) => {
    const { otp, email }: any = request.query;
    if (!otp || !email) return sendResponse(401, { error: "email or code missing" }, response);

    try {
      const user = await prisma.users.findUnique({ where: { email } });
      if (!user) return sendResponse(404, { error: "User not found" }, response);

      if (Number(otp) !== user.resetCode || !user.isChangePassword)
        return sendResponse(403, { error: "Code not valid" }, response);

      return sendSuccess(response, { token: user.resetToken });
    } catch (error) {
      console.log(error);
      return throwError(response);
    }
  };

  changePassword = async (request: Request, response: Response) => {
    const { email, token, newPassword } = request.body;
    if (!email || !token || !newPassword) return sendResponse(400, { error: "email and token required" }, response);

    try {
      const user = await prisma.users.findUnique({ where: { email } });
      if (!user) sendResponse(404, { err: "User not found" }, response);
      if (user?.resetToken === token) {
        jwt.verify(token, process.env.RESET_TOKEN_SECRET || "", async (err: any) => {
          if (err || !user?.isChangePassword)
            return sendResponse(401, { error: "token not valid or expired" }, response);

          const hash = await bcrypt.hash(newPassword, 10);
          console.log({ hash });

          await prisma.users.update({
            where: { email: user?.email },
            data: {
              password: hash,
              resetCode: null,
              resetToken: null,
              isChangePassword: false,
            },
          });
        });
      }
      return sendSuccess(response, { msg: "password changed successfully" });
    } catch (error) {
      console.log(error);
      return throwError(response);
    }
  };
}
