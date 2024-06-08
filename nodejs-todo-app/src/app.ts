import "dotenv/config";
import express from "express";
import { json } from "body-parser";
import cors from "cors";
import debug from "debug";
import todoRoutes from "./routes/todosRoutes";
import mainRoutes from "./routes/mainRoutes";

const logger = debug("app:log");
const app = express();
app.use(json());
app.use(cors());

app.use("", mainRoutes);
app.use("/api/todos", todoRoutes);

const port = process.env.PORT || 5003;
app.listen(port, () => {
  logger(`Server listening on ${process.env.host}:${port}`);
});
