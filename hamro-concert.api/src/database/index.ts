import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { Config } from "../Config";

const pool = new Pool({
  host: Config.DB.HOST,
  port: Number(Config.DB.PORT),
  user: Config.DB.USER,
  password: Config.DB.PASSWORD,
  database: Config.DB.NAME,
});

export const db = drizzle(pool);
