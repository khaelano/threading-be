import { z } from "zod";

const createThreadSchema = z.object({
  content: z.string().max(255),
});

const modifyThreadSchema = z.object({
  content: z.string().max(255),
});

const registerSchema = z.object({
  name: z.string().max(255),
  email: z.string().email(),
  password: z.string().max(255),
  passwordConf: z.string().max(255),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().max(255),
});

export { modifyThreadSchema, createThreadSchema, registerSchema, loginSchema };
