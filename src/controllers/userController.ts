import { Request, Response } from "express";
import { prisma } from "../server";
import { sendResponse } from "@helpers";
import bcrypt from "bcrypt";

interface Body {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export class UserController {
  createUser = async (request: Request, response: Response) => {
    const { firstName, email, password } = request.body;

    if (!firstName) return sendResponse(400, { error: "FirstName Required" }, response);

    if (!email) return sendResponse(400, { error: "Email Required" }, response);

    if (!password) return sendResponse(400, { error: "Password Required" }, response);

    try {
      const foundUser = await prisma.users.findUnique({ where: { email } });
      // console.log({ foundUser });

      if (foundUser) return sendResponse(400, { error: "Email Already taken" }, response);
      const secretPasswd = await bcrypt.hash(password, 10);

      const res = await prisma.users.create({
        data: { ...request.body, password: secretPasswd } as Body,
      });

      if (res.id) return sendResponse(200, { success: "userCreated" }, response);

      return sendResponse(503, { error: "Service not available" }, response);
    } catch (error: any) {
      console.log("error creating user", error.message);
      sendResponse(500, { error: "Internal server error" }, response);
    }
  };

  // can be accessible only when logged in.
  updateUser = async (request: Request, response: Response) => {};
}
