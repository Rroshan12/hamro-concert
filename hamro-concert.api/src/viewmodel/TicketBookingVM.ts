export interface TicketBookingVM {
  id: number;
  userName: string;
  userEmail: string;
  ticketData: TicketBookingListVM[];
  seatIds: number[]; // Required for seat-based bookings
}

export interface TicketBookingListVM {
  concertId: string;
  ticketTierId: number;
  quantity: number;
  pricePerTicket: string;
  totalAmount: string;
  status: string;
  createdAt?: Date | null;
  seatNumbers?: string[]; // Seat numbers for seat-based bookings
}
