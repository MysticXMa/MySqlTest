const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParse = require("express").json();

const app = express();
app.use(cors());
app.use(bodyParse);

// Create connection to database

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testi123",
});

db.connect((err) => {
  if (err) {
    console.log("Error while connecting to database", err);
    return;
  }
  console.log("Database has been connected succesfully!");
});

/* CREATE */

app.post("/todos", (req, res) => {
  const { text } = req.body;
  const sql = "INSERT INTO todos (text) VALUES (?)";
  db.query(sql, [text], (err, result) => {
    if (err) {
      res.status(500).send("Problem while adding a task");
      return;
    }
    res.status(201).json({ id: result.insertId, text });
  });
});

/* READ */

app.get("/todos", (req, res) => {
  const sql = "SELECT * FROM todos";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send("Problem while getting a task");
      return;
    }
    res.json(result);
  });
});

/* UPDATE */
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const sql = `UPDATE todos SET completed = ? WHERE id = ?`;

  db.query(sql, [completed, id], (err, result) => {
    if (err) {
      res.status(500).send("Problem putting data");
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send("Task couldn't be found!");
      return;
    }
    res.json({ id, completed });
  });
});

/* DELETE */
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM todos WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send("Problem while deleting a task");
      return;
    }
    console.log(result);

    res.status(204).send();
  });
});

// Listener

const port = 5000;
app.listen(port, () => console.log("Server has started"));
