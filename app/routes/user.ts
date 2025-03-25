import express from "express";
import prisma from "../prisma";
import * as response from "../response";
import { z } from "zod";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const secret = process.env.JWT_SECRET;
if (secret === undefined) {
  throw new Error("Please define JWT_SECRET");
}

const createUserSchema = z.object({
  name: z.string().max(25),
  email: z.string().email(),
  password: z.string().min(8).max(255),
  bio: z.string().max(255),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().max(255),
});

router.post("/user/create", async (req, res) => {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    res
      .status(400)
      .json(response.err(400, "Invalid request body"));
    return;
  }

  const { name, email, password, bio } = result.data;

  const hashedPassword = await argon2.hash(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      bio,
    },
  });

  const token = jwt.sign({ userId: user.id }, secret, {
    expiresIn: "1d",
  });

  res.json(response.ok(user.id));
});

router.post("/user/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res
      .status(400)
      .json(response.err(400, "Invalid request body"));
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
      user !== null &&
      !(await argon2.verify(user.hashedPassword, password))
    ) {
      res
        .status(401)
        .json(
          response.err(401, "Missing or invalid credentials")
        );
      return;
    }
  } catch {
    res
      .status(500)
      .json(response.err(500, "Internal server error"));
  }
});

export default router;
