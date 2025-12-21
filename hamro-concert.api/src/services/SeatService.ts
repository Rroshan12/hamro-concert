import { db } from "../database";
import { seats } from "../database/schema/seat.schema";
import { eq, and } from "drizzle-orm";
import { SeatListVM, SeatVM } from "../viewmodel/SeatVM";

export class SeatService {
  // Get all seats for a specific concert
  async getSeatsByConcert(concertId: string): Promise<SeatListVM> {
    const concertSeats = await db
      .select()
      .from(seats)
      .where(eq(seats.concertId, concertId));

    const seatVMs: SeatVM[] = concertSeats.map(seat => ({
      id: seat.id,
      concertId: seat.concertId,
      ticketTierId: seat.ticketTierId,
      seatNumber: seat.seatNumber,
      row: seat.row,
      section: seat.section,
      isBooked: seat.isBooked,
      userId: seat.userId || undefined,
      bookedAt: seat.bookedAt || undefined,
      createdAt: seat.createdAt,
      updatedAt: seat.updatedAt,
    }));

    const totalSeats = seatVMs.length;
    const availableSeats = seatVMs.filter(seat => !seat.isBooked).length;
    const bookedSeats = seatVMs.filter(seat => seat.isBooked).length;

    return {
      seats: seatVMs,
      totalSeats,
      availableSeats,
      bookedSeats,
    };
  }

  // Get available seats for a specific concert
  async getAvailableSeatsByConcert(concertId: string): Promise<SeatVM[]> {
    const availableSeats = await db
      .select()
      .from(seats)
      .where(and(
        eq(seats.concertId, concertId),
        eq(seats.isBooked, false)
      ));

    return availableSeats.map(seat => ({
      id: seat.id,
      concertId: seat.concertId,
      ticketTierId: seat.ticketTierId,
      seatNumber: seat.seatNumber,
      row: seat.row,
      section: seat.section,
      isBooked: seat.isBooked,
      userId: seat.userId || undefined,
      bookedAt: seat.bookedAt || undefined,
      createdAt: seat.createdAt,
      updatedAt: seat.updatedAt,
    }));
  }
}
