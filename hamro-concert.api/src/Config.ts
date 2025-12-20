import dotenv from "dotenv";

dotenv.config();

export const Config = {
  PORT:process.env.PORT || 3000,
  BASE_URL: process.env.BASE_URL,
  DB: {
    HOST: process.env.DB_HOST || "localhost",
    PORT: process.env.DB_PORT || 5432,
    USER: process.env.DB_USER || "postgres",
    PASSWORD: process.env.DB_PASSWORD || "",
    NAME: process.env.DB_NAME || "",
  },
};
