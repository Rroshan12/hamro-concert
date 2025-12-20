import {
  pgTable,
  serial,
  integer,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";
import { concerts } from "./concert.schema";
import { ticketTypes } from "./ticket.type.schema";


export const ticketTiers = pgTable("ticket_tiers", {
  id: serial("id").primaryKey(),

  concertId: varchar("concert_id")
    .notNull()
    .references(() => concerts.id, { onDelete: "cascade" }),

  ticketTypeId: integer("ticket_type_id")
    .notNull()
    .references(() => ticketTypes.id),

  price: numeric("price", { precision: 10, scale: 2 }).notNull(),

  total: integer("total").notNull(),
  available: integer("available").notNull(),
});
