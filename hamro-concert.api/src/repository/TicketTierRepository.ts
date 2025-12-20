import { eq } from "drizzle-orm";
import { ITicketTierRepository } from "../interface/ITicketTierRepository";
import { TicketTier } from "../model/TicketTier";
import { db } from "../database";
import { ticketTiers } from "../database/schema/ticket.tire.schema";
import { paginate, PaginatedResult } from "../helper/pagination";

export class TicketTierRepository implements ITicketTierRepository {
  private db = db;

  getBaseQuery() {
    return this.db
      .select({
        id: ticketTiers.id,
        concertId: ticketTiers.concertId,
        ticketTypeId: ticketTiers.ticketTypeId,
        price: ticketTiers.price,
        total: ticketTiers.total,
        available: ticketTiers.available,
      })
      .from(ticketTiers);
  }

  async findById(id: number): Promise<TicketTier | null> {
    const [row] = await db
      .select()
      .from(ticketTiers)
      .where(eq(ticketTiers.id, id));
    if (!row) {
      const error = new Error("Ticket tier not found");
      (error as any).status = 404;
      throw error;
    }
    return row as TicketTier;
  }

  async findAll(page = 1, limit = 10): Promise<PaginatedResult<TicketTier>> {
    const query = this.getBaseQuery();
    return paginate<TicketTier>(this.db, query, ticketTiers, page, limit);
  }

  async create(ticketTier: Omit<TicketTier, "id">): Promise<TicketTier> {
    const [created] = await db
      .insert(ticketTiers)
      .values(ticketTier)
      .returning();
    return created as TicketTier;
  }

  async update(ticketTier: TicketTier): Promise<TicketTier | null> {
    const [updated] = await db
      .update(ticketTiers)
      .set({
        concertId: ticketTier.concertId,
        ticketTypeId: ticketTier.ticketTypeId,
        price: ticketTier.price,
        total: ticketTier.total,
        available: ticketTier.available,
      })
      .where(eq(ticketTiers.id, ticketTier.id))
      .returning();
    return (updated as TicketTier) ?? null;
  }

  async delete(id: number): Promise<void> {
    await db.delete(ticketTiers).where(eq(ticketTiers.id, id));
  }
}
