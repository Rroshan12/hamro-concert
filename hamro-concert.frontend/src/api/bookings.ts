import http from "./http";

export interface CreateBookingPayload {
  userName: string;
  userEmail: string;
  ticketData: Array<{
    ticketTierId: string | number;
    quantity: number;
  }>;
}

export interface BookingResponse {
  id: string;
}

export async function createBooking(payload: CreateBookingPayload) {
  const res = await http.post<BookingResponse>("/ticket-bookings", payload);
  return res.data;
}
