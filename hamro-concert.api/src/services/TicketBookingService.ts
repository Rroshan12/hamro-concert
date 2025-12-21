/* eslint-disable no-unused-vars */
import { randomUUID } from "crypto";
import { and, eq, gte, sql, inArray } from "drizzle-orm";
import { db } from "../database";
import { users } from "../database/schema/users.schema";
import { ticketTiers } from "../database/schema/ticket.tire.schema";
import { ticketSales } from "../database/schema/ticket.sales.schema";
import { seats } from "../database/schema/seat.schema";
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

  async bookSeats(vm: { userName: string; userEmail: string; seatIds: number[] }): Promise<TicketBookingVM> {
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

      if (!Array.isArray(vm.seatIds) || vm.seatIds.length === 0) {
        const err: any = new Error("seatIds must be a non-empty array");
        err.status = 400;
        throw err;
      }

      // 2) Check if seats are available and get seat details
      const seatsToBook = await tx
        .select()
        .from(seats)
        .where(and(
          inArray(seats.id, vm.seatIds),
          eq(seats.isBooked, false)
        ));

      if (seatsToBook.length !== vm.seatIds.length) {
        const err: any = new Error("Some seats are already booked");
        err.status = 400;
        throw err;
      }

      // 3) Group seats by ticket tier to update ticket tiers
      const tierGroups = seatsToBook.reduce((acc: Record<number, typeof seatsToBook>, seat: any) => {
        if (!acc[seat.ticketTierId]) {
          acc[seat.ticketTierId] = [];
        }
        acc[seat.ticketTierId].push(seat);
        return acc;
      }, {} as Record<number, typeof seatsToBook>);

      const items: TicketBookingListVM[] = [];
      let firstSaleId: number | null = null;

      // 4) Process each ticket tier group
      for (const [ticketTierId, tierSeats] of Object.entries(tierGroups)) {
        const tierId = Number(ticketTierId);
        const quantity = (tierSeats as any[]).length;

        // Load tier
        const [tier] = await tx
          .select({ id: ticketTiers.id, concertId: ticketTiers.concertId, price: ticketTiers.price, available: ticketTiers.available })
          .from(ticketTiers)
          .where(eq(ticketTiers.id, tierId));
        
        if (!tier) {
          const err: any = new Error("Ticket tier not found");
          err.status = 404;
          throw err;
        }

        if (tier.available < quantity) {
          const err: any = new Error("Insufficient tickets available");
          err.status = 400;
          throw err;
        }

        // 5) Decrement available tickets in tier
        const [stockUpdated] = await tx
          .update(ticketTiers)
          .set({ available: sql`${ticketTiers.available} - ${quantity}` })
          .where(and(eq(ticketTiers.id, tierId), gte(ticketTiers.available, quantity)))
          .returning({ available: ticketTiers.available });
        
        if (!stockUpdated) {
          const err: any = new Error("Failed to reserve tickets. Please try again.");
          err.status = 409;
          throw err;
        }

        // 6) Mark seats as booked
        const seatIds = (tierSeats as any[]).map((seat: any) => seat.id);
        await tx
          .update(seats)
          .set({
            isBooked: true,
            userId: userId,
            bookedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(inArray(seats.id, seatIds));

        // 7) Create ticket sales record
        const pricePerTicket = tier.price;
        const totalAmount = (Number(pricePerTicket) * quantity).toFixed(2);
        const seatNumbers = (tierSeats as any[]).map((seat: any) => seat.seatNumber);
        
        const [sale] = await tx
          .insert(ticketSales)
          .values({
            userId,
            concertId: tier.concertId,
            ticketTierId: tier.id,
            quantity: quantity,
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
          seatNumbers: seatNumbers,
        });
      }

      return { 
        id: firstSaleId ?? 0, 
        userName: vm.userName, 
        userEmail: vm.userEmail, 
        ticketData: items,
        seatIds: vm.seatIds
      };
    });
  }

}
