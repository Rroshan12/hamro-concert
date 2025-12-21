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
  async bookSeats(vm: { userName: string; userEmail: string; seatIds: number[] }): Promise<TicketBookingVM> {
    // Using default 'read committed' isolation because we are manually 
    // managing locks via FOR UPDATE for multi-instance safety.
    return await db.transaction(async (tx) => {
      
      // 1) ATOMIC USER UPSERT
      // Prevents unique constraint errors if two instances create the same user.
      const [user] = await tx
        .insert(users)
        .values({ id: randomUUID(), name: vm.userName, email: vm.userEmail })
        .onConflictDoUpdate({
          target: users.email,
          set: { name: vm.userName },
        })
        .returning();

      const userId: string = user.id;

      if (!vm.seatIds || vm.seatIds.length === 0) {
        throw Object.assign(new Error("No seats provided"), { status: 400 });
      }

      // 2) PESSIMISTIC LOCKING - SEATS
      // Instance B will hang here until Instance A commits.
      const seatsToBook = await tx.execute(sql`
        SELECT * FROM ${seats} 
        WHERE ${seats.id} IN (${sql.join(vm.seatIds, sql`, `)}) 
        FOR UPDATE
      `).then((res: any) => res.rows as any[]);

      // Helper to handle raw DB names (snake_case) vs Drizzle names (camelCase)
      const getVal = (obj: any, camel: string, snake: string) => obj[camel] !== undefined ? obj[camel] : obj[snake];

      // 3) VALIDATION AFTER LOCK
      // If Instance A just finished, Instance B wakes up and finds these are now 'true'
      if (!seatsToBook || seatsToBook.length !== vm.seatIds.length) {
        throw Object.assign(new Error("Some seats could not be found"), { status: 404 });
      }

      const isAnyBooked = seatsToBook.some(s => getVal(s, 'isBooked', 'is_booked') === true || getVal(s, 'isBooked', 'is_booked') === 1);
      if (isAnyBooked) {
        throw Object.assign(new Error("Some seats are already booked"), { status: 400 });
      }

      // 4) GROUP BY TIER & LOCK TIERS
      const tierIds = [...new Set(seatsToBook.map(s => getVal(s, 'ticketTierId', 'ticket_tier_id')))].filter(Boolean);

      if (tierIds.length === 0) {
        throw Object.assign(new Error("Invalid seat data: no tiers found"), { status: 500 });
      }

      // Lock Tiers to prevent over-selling stock
      await tx.execute(sql`
        SELECT id FROM ${ticketTiers} 
        WHERE ${ticketTiers.id} IN (${sql.join(tierIds, sql`, `)}) 
        FOR UPDATE
      `);

      const items: TicketBookingListVM[] = [];
      let firstSaleId: number | null = null;

      // 5) PROCESS EACH TIER
      for (const tierId of tierIds) {
        const tierSeats = seatsToBook.filter(s => getVal(s, 'ticketTierId', 'ticket_tier_id') === tierId);
        const quantity = tierSeats.length;

        // Get fresh, locked tier data
        const [tier] = await tx
          .select()
          .from(ticketTiers)
          .where(eq(ticketTiers.id, Number(tierId)));

        if (!tier || tier.available < quantity) {
          throw Object.assign(new Error(`Insufficient tickets for tier: ${tier || tierId}`), { status: 400 });
        }

        // 6) ATOMIC STOCK DECREMENT
        const [stockUpdated] = await tx
          .update(ticketTiers)
          .set({ available: sql`${ticketTiers.available} - ${quantity}` })
          .where(and(eq(ticketTiers.id, Number(tierId)), gte(ticketTiers.available, quantity)))
          .returning();

        if (!stockUpdated) {
          throw Object.assign(new Error("Conflict updating ticket availability"), { status: 409 });
        }

        // 7) MARK SEATS AS BOOKED
        const seatIdsToUpdate = tierSeats.map(s => s.id);
        await tx
          .update(seats)
          .set({
            isBooked: true,
            userId: userId,
            bookedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(inArray(seats.id, seatIdsToUpdate));

        // 8) CREATE SALES RECORD
        const [sale] = await tx
          .insert(ticketSales)
          .values({
            userId,
            concertId: tier.concertId,
            ticketTierId: tier.id,
            quantity: quantity,
            pricePerTicket: tier.price,
            totalAmount: (Number(tier.price) * quantity).toFixed(2),
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
          seatNumbers: tierSeats.map(s => getVal(s, 'seatNumber', 'seat_number')),
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