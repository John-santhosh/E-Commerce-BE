import { Response } from "express";
//  type: "SUCCESS" | "ERROR" = "SUCCESS"
export const sendResponse = (status: number, data: any, response: Response) => {
  return response.status(status).send(data);
  //  return response.status(status).send(data);
};

// export const sendSuccessResponse = ()
