import pg from "pg";
import * as dotenv from 'dotenv';

const Pool = pg.Pool; //initiates the Pool class
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE
});

export default pool;