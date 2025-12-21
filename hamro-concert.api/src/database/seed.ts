import { randomUUID } from "node:crypto";
import { db } from "./index";
import { concerts } from "./schema/concert.schema";
import { ticketTiers } from "./schema/ticket.tire.schema";
import { ticketTypes } from "./schema/ticket.type.schema";
import { seats } from "./schema/seat.schema";
import { eq } from "drizzle-orm";

async function seed() {
  const existingConcerts = await db.select().from(concerts).limit(1);
  if (existingConcerts.length > 0) {
    console.log("Data already seeded. Skipping.");
    return;
  }

  const concert1Id = randomUUID();
  const concert2Id = randomUUID();
  const concert3Id = randomUUID(); // define a unique ID for the third concert

  await db.insert(concerts).values([
    {
      id: concert1Id,
      title: "Hamro Rock Night",
      artist: "The Rockers",
      date: new Date("2025-01-15").toISOString(),
      time: "19:00",
      venue: "Nepal Arena",
      city: "Kathmandu",
      image:
        "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800",
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
      image:
        "https://images.pexels.com/photos/33274219/pexels-photo-33274219.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Experience the soothing sounds of classical music.",
    },
    {
      id: concert3Id,
      title: "Jazz Fiesta",
      artist: "Kathmandu Jazz Band",
      date: new Date("2025-03-05").toISOString(),
      time: "20:00",
      venue: "Lalitpur Jazz Hall",
      city: "Lalitpur",
      image:
        "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Smooth jazz performances to light up your evening.",
    },
  ]);

  const insertedTypes = await db
    .insert(ticketTypes)
    .values([{ name: "VIP" }, { name: "Front Row" }, { name: "GA" }])
    .returning({ id: ticketTypes.id, name: ticketTypes.name });

  const typeMap: Record<string, number> = {};
  insertedTypes.forEach((t) => (typeMap[t.name] = t.id));

  await db.insert(ticketTiers).values([
    // Concert 1
    {
      concertId: concert1Id,
      ticketTypeId: typeMap["VIP"],
      price: "100",
      total: 20,
      available: 20,
    },
    {
      concertId: concert1Id,
      ticketTypeId: typeMap["Front Row"],
      price: "50",
      total: 20,
      available: 20,
    },
    {
      concertId: concert1Id,
      ticketTypeId: typeMap["GA"],
      price: "10",
      total: 60,
      available: 60,
    },

    // Concert 2 (same totals as concert 1)
    {
      concertId: concert2Id,
      ticketTypeId: typeMap["VIP"],
      price: "100",
      total: 20,
      available: 20,
    },
    {
      concertId: concert2Id,
      ticketTypeId: typeMap["Front Row"],
      price: "50",
      total: 20,
      available: 20,
    },
    {
      concertId: concert2Id,
      ticketTypeId: typeMap["GA"],
      price: "10",
      total: 60,
      available: 60,
    },

    // Concert 3 (same totals as concert 1)
    {
      concertId: concert3Id,
      ticketTypeId: typeMap["VIP"],
      price: "100",
      total: 20,
      available: 20,
    },
    {
      concertId: concert3Id,
      ticketTypeId: typeMap["Front Row"],
      price: "50",
      total: 20,
      available: 20,
    },
    {
      concertId: concert3Id,
      ticketTypeId: typeMap["GA"],
      price: "10",
      total: 60,
      available: 60,
    },
  ]);



  // Create seats for each ticket tier
  const allSeats: any[] = [];

  // Helper function to create seats for a specific tier
  const createSeatsForTier = (
    concertId: string,
    ticketTierId: number,
    section: string,
    totalSeats: number
  ) => {
    const seatsForTier = [];
    for (let i = 1; i <= totalSeats; i++) {
      seatsForTier.push({
        concertId,
        ticketTierId,
        seatNumber: `${section.charAt(0).toUpperCase()}-${i}`,
        row: section === 'front' ? 1 : section === 'vip' ? Math.floor((i - 1) / 10) + 2 : Math.floor((i - 1) / 12) + 4,
        section,
        isBooked: false,
      });
    }
    return seatsForTier;
  };

  // Create seats for all concerts and tiers
  const allConcerts = [concert1Id, concert2Id, concert3Id];
  
  for (const concertId of allConcerts) {
    const concertTiers = await db
      .select()
      .from(ticketTiers)
      .where(eq(ticketTiers.concertId, concertId));

    for (const tier of concertTiers) {
      const section = tier.ticketTypeId === typeMap["VIP"] ? 'vip' : 
                     tier.ticketTypeId === typeMap["Front Row"] ? 'front' : 'ga';
      const seatsForTier = createSeatsForTier(concertId, tier.id, section, tier.total);
      allSeats.push(...seatsForTier);
    }
  }

  // Insert all seats
  await db.insert(seats).values(allSeats);

  console.log("Seeding completed!");
}

export default seed;
