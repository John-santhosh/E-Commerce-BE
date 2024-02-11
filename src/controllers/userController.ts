import { Request, Response } from "express";
import { prisma } from "../app";

export class UserController {
  createUser = async (request: Request, response: Response) => {
    console.log({ param: request.params });
    console.log({ body: request.body });
    console.log({ query: request.query });
    // console.log(request);

    const users = await prisma.users.findMany({});
    response.status(200).send({ success: "userCreated", data: users });
  };
}
