import { randomUUID } from "node:crypto";
import { db } from "./index";
import { concerts } from "./schema/concert.schema";
import { ticketTiers } from "./schema/ticket.tire.schema";
import { ticketTypes } from "./schema/ticket.type.schema";

async function seed() {
  const existingConcerts = await db.select().from(concerts).limit(1);
  if (existingConcerts.length > 0) {
    console.log("Data already seeded. Skipping.");
    return;
  }

  const concert1Id = randomUUID();
  const concert2Id = randomUUID();

  await db.insert(concerts).values([
    {
      id: concert1Id,
      title: "Hamro Rock Night",
      artist: "The Rockers",
      date: new Date("2025-01-15").toISOString(),
      time: "19:00",
      venue: "Nepal Arena",
      city: "Kathmandu",
      image: "https://example.com/images/rock-night.jpg",
      description: "An electrifying night of rock music.",
    },
    {
      id: concert2Id,
      title: "Classical Evening",
      artist: "Nepali Symphony",
      date: new Date("2025-02-10").toISOString(),
      time: "18:30",
      venue: "Buddha Mandir",
      city: "Pokhara",
      image: "https://example.com/images/classical-evening.jpg",
      description: "Experience the soothing sounds of classical music.",
    },
  ]);

  const insertedTypes = await db.insert(ticketTypes)
    .values([
      { name: "VIP" },
      { name: "Front Row" },
      { name: "GA" },
    ])
    .returning({ id: ticketTypes.id, name: ticketTypes.name });


  const typeMap: Record<string, number> = {};
  insertedTypes.forEach((t) => (typeMap[t.name] = t.id));


  await db.insert(ticketTiers).values([
    { concertId: concert1Id, ticketTypeId: typeMap["VIP"], price: "100", total: 50, available: 15 },
    { concertId: concert1Id, ticketTypeId: typeMap["Front Row"], price: "50", total: 100, available: 35 },
    { concertId: concert1Id, ticketTypeId: typeMap["GA"], price: "10", total: 500, available: 280 },
    { concertId: concert2Id, ticketTypeId: typeMap["VIP"], price: "100", total: 30, available: 8 },
    { concertId: concert2Id, ticketTypeId: typeMap["Front Row"], price: "50", total: 80, available: 42 },
    { concertId: concert2Id, ticketTypeId: typeMap["GA"], price: "10", total: 600, available: 350 },
  ]);

  console.log("Seeding completed!");
}

export default seed;
