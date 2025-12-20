export interface TicketTier {
  id: number;
  concertId: string;
  ticketTypeId: number;
  price: string;
  total: number;
  available: number;
}
