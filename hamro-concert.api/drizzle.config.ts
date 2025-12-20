import { defineConfig } from "drizzle-kit";
import { Config } from "./src/Config";


export default defineConfig({
  schema: "./src/database/schema/**/*.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: Config.DB.HOST,
    port: Number(Config.DB.PORT),
    user: Config.DB.USER,
    password: Config.DB.PASSWORD,
    database: Config.DB.NAME,
    ssl: false, // set true for production/cloud DBs
  },
});

