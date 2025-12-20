import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const ticketTypes = pgTable("ticket_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(), // VIP, GA, Front Row
});