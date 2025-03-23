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

//get all todos
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

//get a specific todo
//get a specific to do with a number in url
//get the id from the url
//get todo using query, selecting all where id is equal
//send to json
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query(
      "SELECT * FROM items WHERE item_id = $1",
      [id]
    );
    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
})

//update a todo
//get the id from the url
//get title and content from body
//make a query for updated todo
//update items to set the title equal to , and description equal to
//then sent response saying it was updated
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
  
    const newTodo = await pool.query(
      "UPDATE items SET title = $1, content = $2 WHERE item_id = $3",
      [title, content, id]
    );
    res.json("Item has been updated.")
  } catch (err) {
    console.error(err.message);
  }
})

//delete a todo
//get id from url
//query from table where its the id
//sent response saying it was delted
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await pool.query(
      "DELETE FROM items WHERE item_id = $1",
      [id]
    );
    res.json('Item has been deleted.')
  } catch (err) {
    console.error(err.message);
  }
})

//SERVER SETUP//
app.listen(port, () => {
  console.log(`The server has started on port ${port}`);
});