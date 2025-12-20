export interface TicketTierVM {
  id: number;
  concertId: string;
  ticketTypeId: number;
  price: string;
  total: number;
  available: number;
}
