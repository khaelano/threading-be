import express from "express";
import prisma from "./prisma";
import userRouter from "./routes/user";
import threadsRouter from "./routes/threads";
import cors from "cors";

const app = express();
app.use(cors());
const port = 8080;

app.use(express.json());

app.use("/user", userRouter);
app.use("/threads", threadsRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
prisma.$disconnect();
