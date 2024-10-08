import { Router } from "express";
import {
  createTodo,
  createTodos,
  deleteSelectedTodos,
  deleteTodo,
  deleteTodos,
  getTodo,
  getTodos,
  updateTodo,
} from "../controllers/todosController";

const router = Router();

router.post("/multiple", createTodos);
router.post("/", createTodo);
router.get("/", getTodos);
router.get("/:id", getTodo);
router.patch("/:id", updateTodo);
router.delete("/all", deleteTodos);
router.post("/selected", deleteSelectedTodos);
router.delete("/:id", deleteTodo);

export default router;
