export interface Concert {
  id: string;
  title: string;
  artist: string;
  date: string;       // 'YYYY-MM-DD', corresponds to PostgreSQL date
  time: string;       // 'HH:MM:SS', corresponds to PostgreSQL time
  venue: string;
  city: string;
  image: string;
  description: string | null; // optional, since your schema allows null
}
