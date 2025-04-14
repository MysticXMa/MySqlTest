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
      const newValue = !currentValue;
      console.log(id, currentValue);

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

  /* SEND */

  const deleteMultiple = async (id, currentDeleteValue) => {
    try {
      const newValue = !currentDeleteValue;

      const response = await axios.put(`http://localhost:5000/todos/${id}`, {
        selected: newValue,
      });

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, selected: response.data.selected } : todo
        )
      );
    } catch (error) {
      console.error("Problem while deleting multiple objects", error);
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
      <h2>ToDo List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Text</th>
            <th>Completed</th>
            <th>Delete</th>
            <th>Delete Multiple</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>{todo.text}</td>
              <td>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleCompleted(todo.id, todo.completed)}
                />
              </td>
              <td>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={todo.selected}
                  onChange={() => deleteMultiple(todo.id, todo.selected)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task"
          className="textIn"
        />
        <button onClick={addTodos}>Add Task</button>
      </div>
    </div>
  );
}
