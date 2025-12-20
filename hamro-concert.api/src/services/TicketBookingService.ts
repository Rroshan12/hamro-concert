/* eslint-disable no-unused-vars */
import { randomUUID } from "crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "../database";
import { users } from "../database/schema/users.schema";
import { ticketTiers } from "../database/schema/ticket.tire.schema";
import { ticketSales } from "../database/schema/ticket.sales.schema";
import { TicketBookingListVM, TicketBookingVM } from "../viewmodel/TicketBookingVM";

export class TicketBookingService {
  private async runSerializable<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    // Retry on serialization failures (Postgres code 40001)
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await db.transaction(async (tx) => fn(tx), {
          isolationLevel: "serializable" as any,
        });
      } catch (err: any) {
        if (err && (err.code === "40001" || err.code === "CR000")) {
          if (attempt < maxAttempts) continue;
        }
        throw err;
      } 
      
    }
    // Unreachable, but for type completeness
    throw new Error("Transaction retry exhausted");
  }

  async create(vm: { userName: string; userEmail: string; ticketData: { ticketTierId: number; quantity: number }[] }): Promise<TicketBookingVM> {
    return await this.runSerializable(async (tx) => {
      // 1) Find or create user
      let userId: string;
      const existing = await tx.select().from(users).where(eq(users.email, vm.userEmail));
      if (existing.length > 0) {
        userId = existing[0].id;
      } else {
        userId = randomUUID();
        await tx.insert(users).values({ id: userId, name: vm.userName, email: vm.userEmail });
      }

      if (!Array.isArray(vm.ticketData) || vm.ticketData.length === 0) {
        const err: any = new Error("ticketData must be a non-empty array");
        err.status = 400;
        throw err;
      }

      const items: TicketBookingListVM[] = [];
      let firstSaleId: number | null = null;

      for (const item of vm.ticketData) {
        // Load tier
        const [tier] = await tx
          .select({ id: ticketTiers.id, concertId: ticketTiers.concertId, price: ticketTiers.price, available: ticketTiers.available })
          .from(ticketTiers)
          .where(eq(ticketTiers.id, item.ticketTierId));
        if (!tier) {
          const err: any = new Error("Ticket tier not found");
          err.status = 404;
          throw err;
        }
        if (tier.available < item.quantity) {
          const err: any = new Error("Insufficient tickets available");
          err.status = 400;
          throw err;
        }
        // decrement  available tickets
        const [stockUpdated] = await tx
          .update(ticketTiers)
          .set({ available: sql`${ticketTiers.available} - ${item.quantity}` })
          .where(and(eq(ticketTiers.id, item.ticketTierId), gte(ticketTiers.available, item.quantity)))
          .returning({ available: ticketTiers.available });
        if (!stockUpdated) {
          const err: any = new Error("Failed to reserve tickets. Please try again.");
          err.status = 409;
          throw err;
        }

        const pricePerTicket = tier.price;
        const totalAmount = (Number(pricePerTicket) * item.quantity).toFixed(2);
        const [sale] = await tx
          .insert(ticketSales)
          .values({
            userId,
            concertId: tier.concertId,
            ticketTierId: tier.id,
            quantity: item.quantity,
            pricePerTicket: pricePerTicket,
            totalAmount: totalAmount,
            status: "SUCCESS",
          })
          .returning();

        if (firstSaleId === null) firstSaleId = sale.id;

        items.push({
          concertId: sale.concertId,
          ticketTierId: sale.ticketTierId,
          quantity: sale.quantity,
          pricePerTicket: String(sale.pricePerTicket),
          totalAmount: String(sale.totalAmount),
          status: sale.status,
          createdAt: sale.createdAt,
        });
      }

      return { id: firstSaleId ?? 0, userName: vm.userName, userEmail: vm.userEmail, ticketData: items };
    });
  }

}
