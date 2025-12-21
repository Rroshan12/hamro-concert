export interface SeatVM {
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

export interface SeatListVM {
  seats: SeatVM[];
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
}

export interface SeatBookingVM {
  seatIds: number[];
  userName: string;
  userEmail: string;
}
