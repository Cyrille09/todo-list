import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import TodoList from "./components/todoList/TodoList";

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
