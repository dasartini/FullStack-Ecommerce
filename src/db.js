import pg from "pg";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  PORT,
  DB_USER,
} from "./config.js";
 

export const pool = new pg.Pool({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  post:PORT,
});

// export const pool = new pg.Pool({
//   user : "adrian",
//   host : "localhost",
//   password : "filete23olimar",
//   database : "cafe_colombia",
//   post:"3000"
// })
