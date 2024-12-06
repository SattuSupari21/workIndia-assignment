import express, { Express } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use("/api/v1", userRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
