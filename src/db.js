import pg from "pg";
import { DATABASE_URL } from "./config.js";

export const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
  host: new URL(DATABASE_URL).hostname,
  port: new URL(DATABASE_URL).port,
});