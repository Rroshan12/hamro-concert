import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { concerts } from "./concert.schema";
import { users } from "./users.schema";
import { ticketTiers } from "./ticket.tire.schema";

export const ticketSales = pgTable("ticket_sales", {
  id: serial("id").primaryKey(),

  userId: varchar("user_id", { length: 50 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  concertId: varchar("concert_id", { length: 50 })
    .notNull()
    .references(() => concerts.id, { onDelete: "cascade" }),

  ticketTierId: integer("ticket_tier_id")
    .notNull()
    .references(() => ticketTiers.id),

  quantity: integer("quantity").notNull(),

  pricePerTicket: numeric("price_per_ticket", {
    precision: 10,
    scale: 2,
  }).notNull(),

  totalAmount: numeric("total_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),

  status: varchar("status", { length: 20 })
    .notNull()
    .default("SUCCESS"), // SUCCESS | CANCELLED | REFUNDED

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
