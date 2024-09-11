import { RequestHandler } from "express";
import { RunResult } from "sqlite3";

import db from "../database";

interface Todo {
  id: number;
  task: string;
  status: string;
  date: string;
}

/**
 * Get todos
 */
export const getTodos: RequestHandler = async (req: any, res, next) => {
  try {
    const todos = await getTodosInfo(req.query);
    const todosCount = await getTodosInfoCount(req.query);

    res.status(200).json({
      todos,
      page: req.query.page,
      perPage: req.query.itemsPerPage,
      total: todosCount.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create todo
 */
export const createTodo: RequestHandler = async (req, res, next) => {
  if (!req.body.task)
    return res.status(400).json({ error: "task is require!" });

  try {
    const task = req.body.task.trim();

    const result = await createTodoInfo(task);
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

/**
 * Get todo
 */
export const getTodo: RequestHandler<{ id: number }> = async (
  req,
  res,
  next
) => {
  try {
    const todo = await getTodoInfo(req.params.id);

    if (!todo) return res.status(404).json({ message: "TODO NOT FOUND!" });

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

/**
 * Update todo
 */
export const updateTodo: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body.task)
      return res.status(400).json({ error: "task is require!" });

    const todo = await updateTodoInfo(
      parseInt(req.params.id, 10),
      req.body.task,
      req.body.status
    );

    if (!todo) return res.status(404).json({ message: "TODO NOT FOUND!" });

    const todoInfo = await getTodoInfo(parseInt(req.params.id, 10));

    res.status(200).json(todoInfo);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete todo
 */
export const deleteTodo: RequestHandler<{ id: number }> = async (
  req,
  res,
  next
) => {
  try {
    const todo = await deleteTodoInfo(req.params.id);
    if (!todo) return res.status(404).json({ message: "TODO NOT FOUND!" });
    res.status(200).json({ message: "Todo Deleted" });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete todos
 */
export const deleteTodos: RequestHandler = async (req, res, next) => {
  try {
    const todos = await deleteTodosInfo();
    if (!todos) return res.status(404).json({ message: "TODO NOT FOUND!" });
    res.status(200).json({ message: "Todos Deleted" });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete todos
 */
export const deleteSelectedTodos: RequestHandler = async (req, res, next) => {
  try {
    const todos = await deleteSelectedTodosInfo(req.body);
    if (!todos) return res.status(404).json({ message: "TODO NOT FOUND!" });
    res.status(200).json({ message: "Selected Todos Deleted" });
  } catch (error) {
    next(error);
  }
};

function createTodoInfo(task: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    db.run("INSERT INTO todos (task) VALUES (?)", task, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

function getTodosInfo(query: {
  filter: string;
  status: boolean;
  page: number;
  itemsPerPage: number;
}): Promise<Todo[]> {
  return new Promise<Todo[]>((resolve, reject) => {
    const filter = (query.filter && `%${query.filter}%`) || `%%`;
    const status = (query.status && `${query.status}`) || `%%`;
    const offset = (query.page - 1) * query.itemsPerPage;

    db.all(
      `SELECT * FROM todos WHERE task LIKE '${filter}' 
        AND  status LIKE '${status}'
        ORDER BY id DESC
        LIMIT ${query.itemsPerPage}
        OFFSET ${offset}
        `,
      (err, rows: Todo[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

function getTodosInfoCount(query: {
  filter: string;
  status: boolean;
}): Promise<Todo[]> {
  return new Promise<Todo[]>((resolve, reject) => {
    const filter = (query.filter && `%${query.filter}%`) || `%%`;
    const status = (query.status && `${query.status}`) || `%%`;

    db.all(
      `SELECT * FROM todos WHERE task LIKE '${filter}' 
        AND  status LIKE '${status}'
        `,
      (err, rows: Todo[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

function getTodoInfo(id: number): Promise<Todo> {
  return new Promise<Todo>((resolve, reject) => {
    db.get("SELECT * FROM todos WHERE id = ?", id, (err, rows: Todo) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function deleteTodoInfo(id: number): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM todos WHERE id = ?", id, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

function deleteTodosInfo(): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM todos", function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

function deleteSelectedTodosInfo(todos: []): Promise<number> {
  return new Promise((resolve, reject) => {
    const placeholders = todos.map(() => "?").join(",");
    const query = `DELETE FROM todos WHERE id IN (${placeholders})`;
    db.run(query, todos, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

function updateTodoInfo(
  id: number,
  task: string,
  status: string
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE todos SET task = ?, status = ? WHERE id = ?`,
      task,
      status,
      id,
      function (this: RunResult, err: Error) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      }
    );
  });
}
