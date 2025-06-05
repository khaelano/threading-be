import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";

const secret = process.env.JWT_SECRET;
if (secret === undefined) {
  throw new Error("Please define JWT_SECRET");
}

function signToken(userId: string) {
  const token = jwt.sign(
    {
      sub: userId,
    },
    secret!,
    {
      audience: "threading-be",
      issuer: "threading-auth",
      expiresIn: "1h",
    },
  );

  return token;
}

function validateToken(token: string) {
  try {
    return jwt.verify(token, secret!) as JwtPayload;
  } catch (err) {
    return null; // invalid token
  }
}

function jwtExtractor(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, secret!);
    // payload.sub should be your userId
    if (typeof decoded.sub === "string") {
      return decoded.sub;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export { signToken, validateToken, jwtExtractor };
