import { Response } from "express";

export const sendResponse = (status: number, data: any, response: Response) => {
  return response.status(status).send(data || "");
};

export const sendSuccess = (response: Response, data: any = "ok", status: number = 200) => {
  return response.status(status).send(data);
};

export const throwError = (
  response: Response,
  data: any = { error: "Internal server error" },
  status: number = 500,
) => {
  return response.status(status).send(data);
};

export const generateRandomCode = (e: number = 1) => {
  return Math.floor(Math.random() * e);
};
