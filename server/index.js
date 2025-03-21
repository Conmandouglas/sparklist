import express from "express";
import cors from "cors";
import pool from "./db.js";
import * as dotenv from 'dotenv';

//INITIALIZE
const app = express();
const port = process.env.PORT;
dotenv.config();

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//ROUTES//




//SERVER SETUP//
app.listen(port, () => {
  console.log("server has started on port 5001");
});