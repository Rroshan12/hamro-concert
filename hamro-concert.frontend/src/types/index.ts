export interface Concert {
  id: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  image: string;
  description: string;
}
export const TypeId={
  '1': 'VIP',
  '2': 'Front Row',
  '3': 'GA'
}
export interface TicketTier {
  id: string;
  concertId: string;
  ticketTypeId:number,
  price: number;
  available: number;
  total: number;
}

export interface Booking {
  id: string;
  concertId: string;
  tickets: {
    tierId: string;
    type: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  userName: string;
  userEmail: string;
  bookingDate: string;
}
