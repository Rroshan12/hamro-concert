import {
  pgTable,
  serial,
  integer,
  varchar,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { concerts } from "./concert.schema";
import { ticketTiers } from "./ticket.tire.schema";
import { users } from "./users.schema";

export const seats = pgTable(
  "seats",
  {
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
  },
  (table) => ({
    // Fast seat lookup by concert
    concertIdx: index("idx_seats_concert").on(table.concertId),

    // Fast lookup by concert + ticket tier
    concertTierIdx: index("idx_seats_concert_tier").on(
      table.concertId,
      table.ticketTierId
    ),

    //Prevent duplicate seats per concert
    uniqueSeatPerConcert: uniqueIndex("uq_seats_concert_seat").on(
      table.concertId,
      table.seatNumber
    ),

    //Optional: speed up available seat queries
    availableSeatsIdx: index("idx_seats_available").on(
      table.concertId,
      table.isBooked
    ),
  })
);

export type Seat = typeof seats.$inferSelect;
export type NewSeat = typeof seats.$inferInsert;
