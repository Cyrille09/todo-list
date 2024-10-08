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

  const todo = await getTodoInfo({ task: req.body.task });

  if (todo)
    return res
      .status(409)
      .json({ error: `${req.body.task} task already exist!` });

  try {
    const task = req.body.task.trim();

    const result = await createTodoInfo(task);
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

/**
 * Create todos
 */
export const createTodos: RequestHandler = async (req: any, res, next) => {
  if (!req.body.tasks.length)
    return res.status(400).json({ error: "At least one task is require!" });

  const todos = await getTodosInfoWithoutQuery();
  const todo = todos.map((todo: { task: string }) => todo.task);
  const tasks = req.body.tasks.filter((task: string) => !todo.includes(task));
  const existedTasks = req.body.tasks.filter((task: string) =>
    todo.includes(task)
  );

  const joinExistedTasks =
    existedTasks.length > 1
      ? `${existedTasks.slice(0, -1).join(", ")} and ${existedTasks.slice(-1)}`
      : existedTasks[0];

  if (!tasks.length)
    return res
      .status(409)
      .json({ error: `${joinExistedTasks} already exist!` });

  try {
    const result = createTodosInfo(tasks);
    res.status(201).json({
      result,
      existedTasks: `${joinExistedTasks} task already exist!`,
    });
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
    const todo = await getTodoInfo({ id: req.params.id });

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
      return res.status(400).json({ error: "Task is require!" });

    const updateTodo = await getUpdateTodoInfo(
      parseInt(req.params.id, 10),
      req.body.task
    );

    if (updateTodo)
      return res
        .status(409)
        .json({ error: `${updateTodo.task} task already exist!` });

    const todo = await updateTodoInfo(
      parseInt(req.params.id, 10),
      req.body.task,
      req.body.status
    );

    if (!todo) return res.status(404).json({ message: "TODO NOT FOUND!" });

    const todoInfo = await getTodoInfo({ id: parseInt(req.params.id, 10) });

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

function createTodosInfo(tasks: string[]) {
  tasks.forEach((task) => {
    return new Promise<number>((resolve, reject) => {
      const query = `INSERT INTO todos (task) VALUES (?)`;
      db.run(query, [task], (err) => {
        if (err) {
          console.error(`Error inserting task ${task}:`, err);
        } else {
          console.log(`Task ${task} inserted successfully`);
        }
      });
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

function getTodosInfoWithoutQuery(): Promise<Todo[]> {
  return new Promise<Todo[]>((resolve, reject) => {
    db.all(`SELECT * FROM todos`, (err, rows: Todo[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
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

function getTodoInfo(params: {
  id?: number;
  task?: string;
}): Promise<Todo | null> {
  return new Promise<Todo | null>((resolve, reject) => {
    let query = "SELECT * FROM todos WHERE ";
    const queryParams: (number | string)[] = [];

    if (params.id) {
      query += "id = ?";
      queryParams.push(params.id);
    } else if (params.task) {
      query += "LOWER(task) = ?";
      queryParams.push(params.task.toLowerCase());
    } else {
      return reject(new Error("You must provide either an id or a task"));
    }

    db.get(query, queryParams, (err, row: Todo | undefined) => {
      if (err) {
        reject(err);
      } else {
        resolve(row || null);
      }
    });
  });
}

function getUpdateTodoInfo(id: number, task: string): Promise<Todo | null> {
  return new Promise<Todo | null>((resolve, reject) => {
    const query = `
      SELECT * FROM todos 
      WHERE LOWER(task) = ? 
      AND id != ?
    `;
    const queryParams: (number | string)[] = [task.toLowerCase(), id];

    db.get(query, queryParams, (err, row: Todo | undefined) => {
      if (err) {
        reject(err);
      } else {
        resolve(row || null);
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
