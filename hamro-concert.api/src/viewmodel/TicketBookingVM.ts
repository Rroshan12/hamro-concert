export interface TicketBookingVM {
  id: number;
  userName: string;
  userEmail: string;
  ticketData: TicketBookingListVM[]
}

export interface TicketBookingListVM {
  concertId: string;
  ticketTierId: number;
  quantity: number;
  pricePerTicket: string;
  totalAmount: string;
  status: string;
  createdAt?: Date | null;
}
