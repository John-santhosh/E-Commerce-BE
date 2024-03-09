import { Request, Response, NextFunction } from "express";
import { prisma } from "../server";
import jwt from "jsonwebtoken";
import { sendResponse } from "@helpers";
import { Prisma } from "@prisma/client";

export const validateUser = async (request: Request, response: Response, next: NextFunction) => {
  const headerAuthToken: any = request.headers.authorization || request.headers.Authorization || "";

  if (!headerAuthToken) return sendResponse(401, { error: "Authorization token missing" }, response);

  try {
    const findUser = await prisma.user_sessions.findFirst({
      where: {
        authToken: headerAuthToken,
      },
      select: {
        user: true,
        id: true,
        authToken: true,
        isLoggedIn: true,
      },
    });

    if (!findUser) return sendResponse(401, { error: "No sessions found" }, response);

    const { isLoggedIn, id } = findUser;
    if (isLoggedIn == 0) return sendResponse(403, { error: "Token not logged" }, response);
    // verify JWT
    jwt.verify(headerAuthToken as string, process.env.ACCESS_TOKEN_SECRET || "", async (err, decoded) => {
      console.log({ err });
      if (err) {
        await prisma.user_sessions.update({
          where: { id },
          data: {
            isLoggedIn: 0,
          },
        });
        return sendResponse(401, { error: "Token expired or not valid" }, response);
      } else {
        response.locals.user = findUser.user;
        next();
      }
    });
  } catch (error: any) {
    console.log(error.message);
    return sendResponse(500, { error: `Internal server error ${error.message}` }, response);
  }
};
