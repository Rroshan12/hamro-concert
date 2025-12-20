import {
  pgTable,
  varchar,
  text,
  date,
  time,
} from 'drizzle-orm/pg-core';

export const concerts = pgTable('concerts', {
  id: varchar('id', { length: 50 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  artist: varchar('artist', { length: 255 }).notNull(),
  date: date('date').notNull(),
  time: time('time').notNull(),
  venue: varchar('venue', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  image: text('image').notNull(),
  description: text('description'),
});
