// src/app.ts
import express from "express";
import routes from "./routes";
import { Config } from "./Config";
import { databaseExceptionMiddleware } from "./middleware/logger";
import seed from "./database/seed";

const app = express();
app.use(express.json());

app.use("/", routes);
app.use(databaseExceptionMiddleware)

app.listen(Config.PORT
  , () => {
  console.log("Server running on port 3000");
  main();
});

async function main() {
  try {
    await seed(); 
    console.log("App started!");
  } catch (err) {
    console.error("Error during seeding:", err);
  }
}

