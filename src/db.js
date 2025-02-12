import pg from "pg";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  PORT,
  DB_USER,
  DB_URL
} from "./config.js";
 

// export const pool = new pg.Pool({
//   user: DB_USER,
//   host: DB_HOST,
//   password: DB_PASSWORD,
//   database: DB_DATABASE,
//   post:PORT,
// });


export const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});