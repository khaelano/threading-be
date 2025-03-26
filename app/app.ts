import express from "express";
import prisma from "./prisma";
import cors from "cors";
import * as response from "./response";
import * as request from "./request";

const app = express();
const port = 80;

app.use(express.json());
app.use(cors({
  origin: 'https://fir-react-devops.web.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get("/", (req, res) => {
  res.json("Hello world");
});

app.get("/posts", async (req, res) => {
  const allPosts = await prisma.post.findMany();
  res.json(response.ok(allPosts));
});

app.get("/posts/:id", async (req, res) => {
  let requestedId = parseInt(req.params.id);
  if (isNaN(requestedId)) {
    res.status(400).json(response.err(400, "Missing path parameter"));
    return;
  }

  const post = await prisma.post.findUnique({ where: { id: requestedId } });
  if (post === null) {
    res.status(404).json(response.err(404, "Post not found"));
    return;
  }

  res.json(response.ok(post));
});

app.post("/posts", async (req, res) => {
  const result = request.modifyPostSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(response.err(400, "Invalid request body"));
    return;
  }

  const { title, content } = result.data;

  const post = await prisma.post.create({
    data: {
      title,
      content,
    },
  });

  res.json(response.ok(post));
});

app.put("/posts/:id", async (req, res) => {
  let requestedId = parseInt(req.params.id);
  if (isNaN(requestedId)) {
    res.status(400).json(response.err(400, "Missing path parameter"));
    return;
  }

  const result = request.modifyPostSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(response.err(400, "Invalid request body"));
    return;
  }

  const { title, content } = result.data;

  try {
    const post = await prisma.post.update({
      where: { id: requestedId },
      data: {
        title,
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

app.delete("/posts/:id", async (req, res) => {
  let requestedId = parseInt(req.params.id);
  if (isNaN(requestedId)) {
    res.status(400).json(response.err(400, "Missing path parameter"));
    return;
  }

  try {
    const post = await prisma.post.delete({
      where: { id: requestedId },
    });

    res.json(post);
  } catch (error) {
    res.status(404).json(response.err(404, "Post not found"));
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
prisma.$disconnect();
