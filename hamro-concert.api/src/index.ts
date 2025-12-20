// src/app.ts
import express from "express";
import routes from "./routes";
import { Config } from "./Config";

const app = express();
app.use(express.json());

// Use the consolidated routes
app.use("/", routes);

app.listen(Config.PORT
  , () => {
  console.log("Server running on port 3000");
});
