
import {
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const exceptions = pgTable("exceptions", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  stack: text("stack"),
  status: text("status"),
  path: text("path"),
  method: text("method"),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
