import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const port = 8080;

app.use(express.json())

app.get("/", (req, res) => {
  res.json("Hello world");
});

app.get("/posts", async (req, res) => {
  const allPosts = await prisma.post.findMany();
  res.json(allPosts);
});

app.get("/posts/:id", async (req, res) => {
  let requestedId = parseInt(req.params.id);
  if (isNaN(requestedId)) {
    res.status(400).json({ message: "bad request" });
    return;
  }

  const post = await prisma.post.findUnique({ where: { id: requestedId } });

  if (post === null) {
    res.status(404).json({ message: "not found" });
  } else {
    res.json(post);
  }
});

app.post("/posts", async (req, res) => {
  try {

    const { title, content } = req.body as { title: string; content: string };
  
    const post = await prisma.post.create({
      data: {
        title,
        content,
      },
    });
    res.json(post);
  } catch {
    res.status(400).json({message: 'bad request'})
  }
});

app.put("/posts/:id", async (req, res) => {
  let requestedId = parseInt(req.params.id);
  if (isNaN(requestedId)) {
    res.status(400).json({ message: "bad request" });
    return;
  }

  const { title, content } = req.body as { title?: string; content?: string };

  try {
    const post = await prisma.post.update({
      where: { id: requestedId },
      data: {
        title,
        content,
      },
    });

    res.json(post);
  } catch (error) {
    res.status(404).json({ message: "post not found" });
  }
});

app.delete('/posts/:id', async (req, res) => {
  let requestedId = parseInt(req.params.id);
  if (isNaN(requestedId)) {
    res.status(400).json({ message: "bad request" });
    return;
  }

  try {
    const post = await prisma.post.delete({
      where: { id: requestedId },
    });

    res.json(post);
  } catch (error) {
    res.status(404).json({ message: "post not found" });
  }
})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
prisma.$disconnect();
