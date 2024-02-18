import { prisma } from "../server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

const ind = async () => {
  await prisma.userRoles.create({});
};

ind();
