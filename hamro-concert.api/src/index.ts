// src/app.ts
import express from "express";
import routes from "./routes";
import { Config } from "./Config";
import { databaseExceptionMiddleware } from "./middleware/logger";
import seed from "./database/seed";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import cors from "cors";

const app = express();
app.use(express.json());

// CORS configuration
const corsOrigin = (Config.CORS_ORIGIN as string) || "*";
app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
