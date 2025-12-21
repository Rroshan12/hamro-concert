import { useMemo, useState } from 'react';
import Header from './component/Header';
import ConcertCard from './component/Concert/ConcertCard';
import SeatBookingModal from './component/SeatBooking/SeatBookingModal';
import Footer from './component/Footer';
import  { type Concert, type TicketTier } from './types';
import { getConcerts } from './api/concerts';
import { getAllTicketTiers } from './api/ticketTiers';
import ConcertCardShimmer from './component/Concert/ConcertCardShimmer';
import UpCommingInfo from './component/UpCommingInfo';
import { useQuery } from '@tanstack/react-query';


function App() {
  const [selectedConcertForSeat, setSelectedConcertForSeat] = useState<Concert | null>(null);
  const { data: concertsPaged, isLoading: concertsLoading } = useQuery({
    queryKey: ['concerts', { page: 1, limit: 50 }],
    queryFn: () => getConcerts({ page: 1, limit: 50 }),
  });
  const { data: tiersData, isLoading: tiersLoading } = useQuery({
    queryKey: ['ticketTiers', 'all'],
    queryFn: () => getAllTicketTiers(),
  });

  const concerts: Concert[] = concertsPaged?.data || [];
  const ticketTiers: TicketTier[] = tiersData || [];
  const loading = concertsLoading || tiersLoading;

  const getTiersForConcert = useMemo(() => {
    return (concertId: string) => ticketTiers.filter(tier => tier.concertId === concertId);
  }, [ticketTiers]);

  const handleBookSeat = (concert: Concert) => {
    setSelectedConcertForSeat(concert);
  };

  const handleCloseSeatModal = () => {
    setSelectedConcertForSeat(null);
  };

  return (
    <div className="min-h-screen theme-bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <UpCommingInfo />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(loading || concerts.length === 0)
            ? Array.from({ length: 6 }).map((_, idx) => (
                <ConcertCardShimmer key={idx} />
              ))
            : concerts.map(concert => (
                <ConcertCard
                  key={concert.id}
                  concert={concert}
                  tiers={getTiersForConcert(concert.id)}
                  onBookSeat={handleBookSeat}
                />
              ))}
        </div>
      </main>
      {selectedConcertForSeat && (
        <SeatBookingModal
          concert={selectedConcertForSeat}
          ticketTiers={getTiersForConcert(selectedConcertForSeat.id)}
          onClose={handleCloseSeatModal}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
