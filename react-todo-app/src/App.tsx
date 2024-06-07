import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import TodoList from "./components/todoList/TodoList";

/**
 * TODOLIST
 * - pagination
 * - search
 * - display
 * - delete one
 * - delete all
 * - delete selected
 * - update task
 * - update status
 * - add new
 * - resposive page
 * - input field
 * - popup modal
 */
function App() {
  return (
    <div className="AppT">
      <Router>
        <Routes>
          <Route path="/" element={<TodoList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
