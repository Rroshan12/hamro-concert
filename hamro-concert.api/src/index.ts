// src/app.ts
import express from "express";
import routes from "./routes";
import { Config } from "./Config";
import { databaseExceptionMiddleware } from "./middleware/logger";
import seed from "./database/seed";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import cors from "cors";
import { execSync } from "node:child_process";

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
  runMigrationsAndSeed();
});


async function runMigrationsAndSeed() {
  try {
    console.log("Generating migrations...");
    execSync("npm run migrate:generate", { stdio: "inherit" });

    console.log("Updating database...");
    execSync("npm run migrate:update-database", { stdio: "inherit" });

    console.log("Seeding database...");
    await seed();

    console.log("Database ready!");
  } catch (err) {
    console.error("Migration/Seeding failed:", err);
    process.exit(1);
  }
}

