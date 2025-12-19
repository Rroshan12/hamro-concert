import dotenv from "dotenv";

// Load environment variables
dotenv.config();


export const Config = {
    PORT:  process.env.PORT || 3000,
    DB_URL: process.env.DB_URL
}