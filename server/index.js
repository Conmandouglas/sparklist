import express from "express";
import cors from "cors";
import pool from "./db.js";
import * as dotenv from 'dotenv';

//Idea:
//items are called "do's",
//put all your "do's" in one place, and your "dont's as well (this is quirk this is gonna have)

//INITIALIZE
dotenv.config();
const app = express();
const port = process.env.PORT;

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//ROUTES//

//create a todo
app.post('/todos', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newItem = await pool.query(
      "INSERT INTO items (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );
    res.json(newItem.rows[0]);
    //parse to get description
    //query todo add description
    //send it through json
  } catch (err) {
    //error log the message
    console.error(err.message);
  }
})

//get todos
app.get('/todos', async (req, res) => {
  try {
    const items = await pool.query("SELECT * FROM items");
    res.json(items.rows);
    //query all todos from table
    //send through json
  } catch (err) {
    //error log message
    console.error(err.message);
  }
});


//SERVER SETUP//
app.listen(port, () => {
  console.log(`The server has started on port ${port}`);
});