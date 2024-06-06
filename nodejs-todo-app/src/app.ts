import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import cors from "cors";
import debug from "debug";
import todoRoutes from "./routes/todosRoutes";

const logger = debug("app:log");
const app = express();
app.use(json());
app.use(cors());

app.use("/api/todos", todoRoutes);
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: error.message });
});

const port = process.env.PORT || 5003;
app.listen(port, () => {
  logger(`Server listening on ${process.env.host}:${port}`);
});
