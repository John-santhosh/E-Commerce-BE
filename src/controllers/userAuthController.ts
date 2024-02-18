import { Request, Response } from "express";
import { sendResponse } from "@helpers";

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
