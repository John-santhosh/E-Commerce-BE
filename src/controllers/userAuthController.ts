import { Request, Response } from "express";
import { sendResponse, sendSuccess, throwError } from "@helpers";
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
    const random = Math.floor(Math.random() * 10000);
    const token = jwt.sign({ random }, "e76ecb32dea6385a", { expiresIn: "15m" });
    console.log({ token });

    try {
      await prisma.users.update({
        where: {
          email,
        },
        data: {
          resetCode: random,
          resetToken: token,
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
    return response.sendStatus(200);
  };
  //g
  verifyOTP = async (request: Request, response: Response) => {
    return response.sendStatus(200);
  };

  changePassword = async (request: Request, response: Response) => {
    return response.sendStatus(200);
  };
}
