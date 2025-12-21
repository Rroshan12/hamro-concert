import {
  pgTable,
  serial,
  integer,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { concerts } from "./concert.schema";
import { ticketTiers } from "./ticket.tire.schema";
import { users } from "./users.schema";

export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),

  concertId: varchar("concert_id")
    .notNull()
    .references(() => concerts.id, { onDelete: "cascade" }),

  ticketTierId: integer("ticket_tier_id")
    .notNull()
    .references(() => ticketTiers.id, { onDelete: "cascade" }),

  seatNumber: varchar("seat_number").notNull(), // e.g., "F-1", "V-1", "G-1"
  row: integer("row").notNull(),
  section: varchar("section").notNull(), // "front", "vip", "ga"

  isBooked: boolean("is_booked").default(false).notNull(),
  userId: varchar("user_id").references(() => users.id),

  bookedAt: timestamp("booked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Seat = typeof seats.$inferSelect;
export type NewSeat = typeof seats.$inferInsert;
