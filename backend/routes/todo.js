import express from "express";
import {
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todosController.js";

const router = express.Router();

router.get("/", getTodo);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
