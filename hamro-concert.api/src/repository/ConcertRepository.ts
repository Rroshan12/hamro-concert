
import { eq } from "drizzle-orm";
import { IConcertRepository } from "../interface/IConcertRepository";
import { Concert } from "../model/Concert";
import { db } from "../database";
import { concerts } from "../database/schema/concert.schema";
import { randomUUID } from "crypto";
import { paginate, PaginatedResult } from "../helper/pagination";

export class ConcertRepository implements IConcertRepository {
  private db = db;
    getBaseQuery() {
    return this.db
      .select({
        id: concerts.id,
        title: concerts.title,
        artist: concerts.artist,
        date: concerts.date,
        time: concerts.time,
        venue: concerts.venue,
        city: concerts.city,
        image: concerts.image,
        description: concerts.description,
      })
      .from(concerts);
  }
  async findById(id: string): Promise<Concert | null> {
    const [concert] = await db.select().from(concerts).where(eq(concerts.id, id));
    return concert ?? null;
  }

   async findAll(page = 1, limit = 10): Promise<PaginatedResult<Concert>> {
    const query = this.getBaseQuery();
    return paginate<Concert>(this.db, query, concerts, page, limit);
  }


  async create(concert: Omit<Concert, "id">): Promise<Concert> {
    const concertToInsert = {
      id: randomUUID(), // generate UUID for the ID
      ...concert,
      description: concert.description ?? null, // ensure nullable
    };

    const [created] = await db.insert(concerts).values(concertToInsert).returning();
    return created;
  }

  async update(concert:Concert): Promise<Concert | null> {
    const [updated] = await db.update(concerts).set(concert).where(eq(concerts.id, concert.id)).returning();
    return updated ?? null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(concerts).where(eq(concerts.id, id));
  }
}
