import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ToDoList() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodos = async () => {
    try {
      const response = await axios.post("http://localhost:5000/todos", {
        text: newTask,
      });
      setTodos([...todos, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Problem while adding a task", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Problem while getting a task", error);
    }
  };

  /* SEND */

  const toggleCompleted = async (id, currentValue) => {
    try {
      const newValue = currentValue ? 0 : 1;

      const response = await axios.put(`http://localhost:5000/todos/${id}`, {
        completed: newValue,
      });

      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? { ...todo, completed: response.data.completed }
            : todo
        )
      );
    } catch (error) {
      console.error("Problem while toggling completion", error);
    }
  };

  /* DELETE */

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter((todos) => todos.id !== id));
    } catch (error) {
      console.error("There was a problem with deleting the task", error);
    }
  };

  return (
    <div>
      ToDoList
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            |{todo.text}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>|
            Completed
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompleted(todo.id, todo.completed)}
            ></input>
            |
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add new task"
        className="textIn"
      ></input>
      <button onClick={addTodos}>Add Task</button>
    </div>
  );
}
