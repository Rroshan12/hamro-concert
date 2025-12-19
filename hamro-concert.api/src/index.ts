import express, { Request, Response } from "express";
import { Config } from "./Config";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Node + TypeScript API running");
});

app.listen(Config.PORT, () => {
  console.log("Server running on http://localhost:3000");
});
