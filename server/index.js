import express from "express";
import cors from "cors";
import pool from "./db.js";
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import session from 'express-session';
import flash from 'express-flash';
import passport from 'passport';
import initializePassport from './passportConfig.js';
initializePassport(passport);


//Idea:
//items are called "do's",
//put all your "do's" in one place, and your "dont's as well (this is quirk this is gonna have)

//INITIALIZE
dotenv.config();
const app = express();
const port = process.env.PORT;
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

//MIDDLEWARE
app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Makes sure the cookie cannot be accessed via JavaScript
    secure: process.env.NODE_ENV === 'production', // Set to true in production if using HTTPS
    maxAge: 1000 * 60 * 60 * 24, // Cookie expiry (e.g., 24 hours)
  }
}));

app.use(passport.initialize()); // ✅ Must call the function
app.use(passport.session());    // ✅ Must call the function

app.use(flash());

//ROUTES//


///T0DOS/
//get all todos
app.get('/todos', async (req, res) => {
  const { user_id, list_id } = req.query;

  // Check if user_id and list_id are provided
  if (!user_id || !list_id) {
    return res.status(400).json({ error: "Missing user_id or list_id" });
  }

  try {
    // Query todos for a specific user and list
    const items = await pool.query(
      "SELECT * FROM items WHERE user_id = $1 AND list_id = $2 ORDER BY pinned DESC, importance DESC, item_id DESC",
      [user_id, list_id]
    );
    
    res.json(items.rows); // Send the todos as a JSON array
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});


//create a todo
app.post('/todos', async (req, res) => {
  try {
    const { title, content, color, importance, list_id, remind_at, user_id } = req.body;
    console.log("Received remind_at:", remind_at);

    // Validate input data
    if (!title || !content || isNaN(importance) || isNaN(list_id)) {
      return res.status(400).json({ error: "Invalid input." });
    }

    // Ensure importance is an integer, default to 3 if not provided
    const importanceValue = importance ? parseInt(importance) : 3;

    // Insert into the database, setting remind_at to null if not provided
    const newItem = await pool.query(
      "INSERT INTO items (title, content, color, importance, list_id, remind_at, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, content, color, importanceValue, list_id, remind_at, user_id || null]
    );

    // Ensure list_id exists and is valid
    if (!list_id) {
      return res.status(400).json({ error: "Missing list_id" });
    }

    res.json(newItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, color, importance, list_id, remind_at } = req.body;
  
    const newTodo = await pool.query(
      "UPDATE items SET title = $1, content = $2, color = $3, importance = $4, list_id = $5, remind_at = $6 WHERE item_id = $7",
      [title, content, color, importance, list_id, remind_at, id]
    );
    res.json("Item has been updated.")
  } catch (err) {
    console.error(err.message);
  }
});

//get a specific todo
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
});

//delete a todo
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

//pin a todo (update the pinned column in a todo item)
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

//LISTS//

//get lists
app.get('/lists', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id" });
  }
  
  try {
    const lists = await pool.query(
      "SELECT * FROM lists WHERE user_id = $1",
      [user_id]
    );

    res.json(lists.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
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

// Create a list (now supports user_id)
app.post('/lists', async (req, res) => {
  try {
    const { listName, user_id } = req.body;

    if (!listName || !user_id) {
      return res.status(400).json({ error: "List name and user_id are required" });
    }

    const newList = await pool.query(
      "INSERT INTO lists (name, user_id) VALUES ($1, $2) RETURNING *",
      [listName, user_id]
    );

    res.json(newList.rows[0]);
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

app.delete('/lists/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const list = await pool.query(
      'DELETE FROM lists WHERE list_id = $1',
      [id]
    );
    res.json('List has been deleted');
  } catch (err) {
    console.error(err.message);
    /*if (err.code === '23503') {
      res.status(400).json({ error: 'There are open todos in this list. Please complete them first.'})
    } else {
      console.error("Full error object:", err);
      res.status(500).send("Server error");
    }*/
  }
});

//USER LOGIN & AUTH//

app.post('/users/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Basic validations
  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }
  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters" });
  }
  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ errors: [{ message: "User already exists." }] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING user_id, name, email",
      [name, email, hashedPassword]
    );

    // Create a default list for the new user
    const defaultListName = "Default List"; // Default list name
    const userId = newUser.rows[0].user_id;

    // Insert the default list into the database
    const newList = await pool.query(
      "INSERT INTO lists (name, user_id) VALUES ($1, $2) RETURNING list_id, name",
      [defaultListName, userId]
    );

    // Send back success response with user data and the default list
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: newUser.rows[0].user_id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
      },
      defaultList: newList.rows[0]  // Include the default list
    });

  } catch (err) {
    console.error("Registration error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/users/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!user) {
      // Authentication failed
      return res.status(401).json({ errors: [{ message: info.message || 'Invalid credentials' }] });
    }
    // Authentication succeeded
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Login failed' });
      }
      return res.status(200).json({
        message: 'Login successful',
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email
        }
      });      
    });
  })(req, res, next);
});

//for a forgot password button, maybe also edit username button
app.put('/users/editname', async (req, res) => {
  const { newName, user_id } = req.body;

  // Debugging: Check what is coming in the request
  console.log("Received newName:", newName);
  console.log("Received user_id:", user_id);

  if (!newName || !user_id) {
    return res.status(400).json({ error: "Missing newName or user_id" });
  }

  try {
    const updatedUser = await pool.query(
      "UPDATE users SET name = $1 WHERE user_id = $2 RETURNING *",
      [newName, user_id]
    );

    if (updatedUser.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ name: updatedUser.rows[0].name });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//SERVER SETUP//
app.listen(port, () => {
  console.log(`The server has started on port ${port}`);
});