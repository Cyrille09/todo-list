import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  deleteTodos,
  getTodo,
  getTodos,
  updateTodo,
  updateTodoStatus,
} from "../controllers/todosController";

const router = Router();

router.post("/", createTodo);
router.get("/", getTodos);
router.get("/:id", getTodo);
router.patch("/status/:id", updateTodoStatus);
router.patch("/:id", updateTodo);
router.delete("/all", deleteTodos);
router.delete("/:id", deleteTodo);

export default router;
