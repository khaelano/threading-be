import express from "express";
import prisma from "../prisma";
import * as response from "../response";
import * as request from "../request";
import { jwtExtractor } from "../jwt";

const threadsRouter = express.Router();

threadsRouter.get("/", async (req, res) => {
  const { author } = req.query;
  const allPosts = await prisma.thread.findMany({
    where: {
      authorId: typeof author === "string" ? parseInt(author) : undefined,
    },
  });
  res.json(response.ok(allPosts));
});

threadsRouter.get("/:id", async (req, res) => {
  let requestedId = parseInt(req.params.id);
  if (isNaN(requestedId)) {
    res.status(400).json(response.err(400, "Missing path parameter"));
    return;
  }

  const post = await prisma.thread.findUnique({ where: { id: requestedId } });
  if (post === null) {
    res.status(404).json(response.err(404, "Post not found"));
    return;
  }

  res.json(response.ok(post));
});

threadsRouter.post("/", async (req, res) => {
  const userId = jwtExtractor(req);
  if (userId === null) {
    res.status(401).json(response.err(401, "Failed to authenticate"));
    return;
  }
  const result = request.modifyThreadSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(response.err(400, "Invalid request body"));
    return;
  }

  const { content } = result.data;

  const post = await prisma.thread.create({
    data: {
      author: {
        connect: {
          id: parseInt(userId!),
        },
      },
      content,
    },
  });

  res.json(response.ok(post));
});

threadsRouter.put("/:id", async (req, res) => {
  const userId = jwtExtractor(req);
  if (userId === null) {
    res.status(401).json(response.err(401, "Failed to authenticate"));
    return;
  }
  let requestedId = parseInt(req.params.id);
  if (isNaN(requestedId)) {
    res.status(400).json(response.err(400, "Missing path parameter"));
    return;
  }

  const result = request.modifyThreadSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(response.err(400, "Invalid request body"));
    return;
  }

  const { content } = result.data;

  try {
    const post = await prisma.thread.update({
      where: { id: requestedId, authorId: parseInt(userId) },
      data: {
        content,
      },
    });
    if (post === null) {
      res.status(404).json(response.err(404, "Post not found"));
    }

    res.json(response.ok(post));
  } catch {
    res.status(404).json(response.err(404, "Post not found"));
    return;
  }
});

threadsRouter.delete("/:id", async (req, res) => {
  const userId = jwtExtractor(req);
  if (userId === null) {
    res.status(401).json(response.err(401, "Failed to authenticate"));
    return;
  }
  let requestedId = parseInt(req.params.id);
  if (isNaN(requestedId)) {
    res.status(400).json(response.err(400, "Missing path parameter"));
    return;
  }

  try {
    const post = await prisma.thread.delete({
      where: { id: requestedId, authorId: parseInt(userId) },
    });

    res.json(post);
  } catch (error) {
    res.status(404).json(response.err(404, "Post not found"));
  }
});

export default threadsRouter;
