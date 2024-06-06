import sqlite3 from "sqlite3";

const dbFilePath = "todos.db";
// Open SQLite database connection
// const db = new sqlite3.Database(":memory:");
const db = new sqlite3.Database(dbFilePath);

// Create todos table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY,
    task TEXT NOT NULL,
    status BOOLEAN NOT NULL DEFAULT 0
  )
`);

export default db;
