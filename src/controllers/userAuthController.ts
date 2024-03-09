import { Request, Response } from "express";
import { sendResponse } from "@helpers";
import { prisma } from "src/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

export class UserAuthController {
  //p
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

    const authToken = jwt.sign({ email, password }, secretKey || "", { expiresIn: "100s" });
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
  //p
  logOut = async (request: Request, response: Response) => {
    return response.sendStatus(200);
  };
  // p
  forgetPassword = async (request: Request, response: Response) => {
    return response.sendStatus(200);
  };
  // p
  emailVerification = async (request: Request, response: Response) => {
    return response.sendStatus(200);
  };
  //g
  verifyOTP = async (request: Request, response: Response) => {
    return response.sendStatus(200);
  };
}
