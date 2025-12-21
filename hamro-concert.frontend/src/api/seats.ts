import { http } from "./http";

export interface Seat {
  id: number;
  concertId: string;
  ticketTierId: number;
  seatNumber: string;
  row: number;
  section: string;
  isBooked: boolean;
  userId?: string;
  bookedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeatListResponse {
  seats: Seat[];
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
}

export interface SeatBookingRequest {
  userName: string;
  userEmail: string;
  seatIds: number[];
}

export interface SeatBookingResponse {
  id: number;
  userName: string;
  userEmail: string;
  ticketData: {
    concertId: string;
    ticketTierId: number;
    quantity: number;
    pricePerTicket: string;
    totalAmount: string;
    status: string;
    createdAt?: Date | null;
    seatNumbers?: string[];
  }[];
  seatIds: number[];
}

// Get all seats for a concert
export const getSeatsByConcert = async (concertId: string): Promise<SeatListResponse> => {
  const response = await http.get(`/seats/concert/${concertId}`);
  return response.data;
};

// Get available seats for a concert
export const getAvailableSeatsByConcert = async (concertId: string): Promise<Seat[]> => {
  const response = await http.get(`/seats/concert/${concertId}/available`);
  return response.data;
};

// Book specific seats
export const bookSeats = async (bookingData: SeatBookingRequest): Promise<SeatBookingResponse> => {
  const response = await http.post("/ticket-bookings/seats", bookingData);
  return response.data;
};
