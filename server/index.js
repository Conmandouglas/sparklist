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
    const { title, content, color, importance, list_id } = req.body;
    
    if (!title || !content || isNaN(importance) || isNaN(list_id)) {
      return res.status(400).json({ error: "Invalid input." });
    }  
    
    // Ensure importance is an integer
    const importanceValue = importance ? parseInt(importance) : 3;

    const newItem = await pool.query(
      "INSERT INTO items (title, content, color, importance, list_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, content, color, importanceValue, list_id]
    );
    if (!list_id) {
      return res.status(400).json({ error: "Missing list_id" });
    }    

    res.json(newItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});


//get all todos
app.get('/todos', async (req, res) => {
  try {
    const items = await pool.query(
      "SELECT * FROM items ORDER BY pinned DESC, importance DESC, item_id DESC"
    );
    res.json(items.rows); // Send as JSON array
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//create a list
app.post('/lists', async (req, res) => {
  try {
    const { listName } = req.body;

    const newList = await pool.query(
      "INSERT INTO lists (name) VALUES ($1) RETURNING *",
      [listName]
    );

    res.json(newList.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//get lists
app.get('/lists', async (req, res) => {
  try {
    const lists = await pool.query(
      "SELECT * FROM lists"
    );

    res.json(lists.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//update a list name
app.put('/lists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const newList = await pool.query(
      "UPDATE lists SET name = $1 WHERE list_id = $2",
      [name, id]
    );

    res.json("List name has been updated!")
  } catch (err) {
    console.error(err.message);
  }
});

//get specific list
app.get('/lists/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const list = await pool.query(
      "SELECT * FROM items WHERE list_id = $1",
      [ id ]
    );

    res.json(list.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.delete('/lists/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const list = await pool.query(
      'DELETE FROM lists WHERE list_id = $1',
      [id]
    );
    res.json('List has been deleted');
  } catch (err) {
    if (err.code === '23503') {
      res.status(400).json({ error: 'There are open todos in this list. Please complete them first.'})
    } else {
      console.error("Full error object:", err);
      res.status(500).send("Server error");
    }
  }
})


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
    const { title, content, color, importance, list_id } = req.body;
  
    const newTodo = await pool.query(
      "UPDATE items SET title = $1, content = $2, color = $3, importance = $4, list_id = $5 WHERE item_id = $6",
      [title, content, color, importance, list_id, id]
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

app.put("/todos/:id/pin", async (req, res) => {
  try {
    const { id } = req.params;

    // Count how many notes are pinned
    const pinnedCount = await pool.query(
      "SELECT COUNT(*) FROM items WHERE pinned = TRUE"
    );

    // Get the current pinned status of the note
    const currentNote = await pool.query(
      "SELECT pinned FROM items WHERE item_id = $1",
      [id]
    );

    // If the note exists, toggle its pin status
    if (currentNote.rows.length > 0) {
      const currentPinned = currentNote.rows[0].pinned;
      
      // If trying to pin and already 3 notes are pinned, prevent it
      if (!currentPinned && parseInt(pinnedCount.rows[0].count) >= 3) {
        return res.status(400).json({ error: "Cannot pin more than 3 notes" });
      }

      // Toggle pin state
      const updateNote = await pool.query(
        "UPDATE items SET pinned = NOT pinned WHERE item_id = $1 RETURNING *",
        [id]
      );

      return res.json(updateNote.rows[0]);
    }

    return res.status(404).json({ error: "Note not found" });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//SERVER SETUP//
app.listen(port, () => {
  console.log(`The server has started on port ${port}`);
});