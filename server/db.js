import pg from "pg";

const Pool = pg.Pool; //initiates the Pool class

const pool = new Pool({
  user: "postgres",
  password: "the_password",
  host: "localhost",
  port: 5433,
  database: "contodo"
});

export default pool;