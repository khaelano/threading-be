import express from "express";
import prisma from "../prisma";
import * as response from "../response";
import { z } from "zod";
import * as argon2 from "argon2";
import { signToken } from "../jwt";
import dotenv from "dotenv";
import { loginSchema, registerSchema } from "../request";

dotenv.config();
const userRouter = express.Router();

const secret = process.env.JWT_SECRET;
if (secret === undefined) {
  throw new Error("Please define JWT_SECRET");
}

userRouter.post("/register", async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    console.log(req.body);
    res.status(400).json(response.err(400, "Invalid request body"));
    return;
  }

  const { name, email, password } = result.data;

  const existing = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existing != null) {
    res.status(401).json(response.err(401, "User already created"));
    return;
  }

  const hashedPassword = await argon2.hash(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  const token = signToken(user.id.toString());
  res.json(response.ok(token));
});

userRouter.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(response.err(400, "Invalid request body"));
    return;
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  try {
    if (
      user === null ||
      !(await argon2.verify(user.hashedPassword, password))
    ) {
      res.status(401).json(response.err(401, "Missing or invalid credentials"));
      return;
    }

    const token = signToken(user.id.toString());

    res.json(response.ok(token));
  } catch {
    res.status(500).json(response.err(500, "Internal server error"));
  }
});

export default userRouter;
