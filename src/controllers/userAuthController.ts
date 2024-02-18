import { Request, Response } from "express";
import { createServer, prisma } from "../server";
import { sendResponse } from "../helpers";

// const app = createServer();

// const router = app.Router

export class UserAuthController {
  //p
  login = async (request: Request, response: Response) => {
    return response.send(200);
  };
  //p
  logOut = async (request: Request, response: Response) => {
    return response.send(200);
  };
  // p
  forgetPassword = async (request: Request, response: Response) => {
    return response.send(200);
  };
  // p
  emailVerification = async (request: Request, response: Response) => {
    return response.send(200);
  };
  //g
  verifyOTP = async (request: Request, response: Response) => {
    return response.send(200);
  };
}
