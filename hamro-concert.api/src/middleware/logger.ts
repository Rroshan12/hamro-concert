// src/middleware/database-exception.middleware.ts
import { Request, Response, NextFunction } from "express";
import { db } from "../database";
import { exceptions } from "../database/schema/exception.schema";

export const databaseExceptionMiddleware = async (
  err: any,
  req: Request,
  res: Response,
) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  const stack = err.stack || null;


  //Save custom exception to database also can sent to monitor tool like grafana, signoz, datadog
  try {
    await db.insert(exceptions).values({
      message,
      stack,
      status: status.toString(),
      path: req.originalUrl || req.url,
      method: req.method,
    });
  } catch (dbError) {
    console.error("Failed to log exception to DB", dbError);
  }

  res.status(status).json({
    statusCode: status,
    path: req.originalUrl || req.url,
    method: req.method,
    message,
  });
};
