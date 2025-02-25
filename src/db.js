import pg from "pg";
import { DATABASE_URL, DB_USER, DB_HOST, DB_PASSWORD, DB_DATABASE, DB_PORT } from "./config.js";

const isProd = process.env.NODE_ENV === 'production';
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (val) => parseFloat(val));
export const pool = isProd
  ? new pg.Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      host: new URL(DATABASE_URL).hostname,
        port: new URL(DATABASE_URL).port,
    })
  : new pg.Pool({
      user: DB_USER,
      host: DB_HOST,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      post: DB_PORT,
    });
