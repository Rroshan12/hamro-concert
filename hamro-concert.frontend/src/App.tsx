import { useEffect, useState } from 'react';
import Header from './component/Header';
import ConcertCard from './component/ConcertCard';
import BookingModal from './component/Booking/BookingModal';
import Footer from './component/Footer';
import  { type Concert, type TicketTier } from './types';
import { getConcerts } from './api/concerts';
import { getAllTicketTiers } from './api/ticketTiers';
import ConcertCardShimmer from './component/ConcertCardShimmer';

function App() {
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleBookNow = (concert: Concert) => {
    setSelectedConcert(concert);
  };

  const handleCloseModal = () => {
    setSelectedConcert(null);
  };
  useEffect(() => {
    (async () => {
        try {
          const [concertPaged, tiers] = await Promise.all([
            getConcerts({ page: 1, limit: 50 }),
            getAllTicketTiers(),
          ]);
          setConcerts(concertPaged.data || []);
          setTicketTiers(tiers || []);
        } finally {
          setLoading(false);
        }
    })();
  }, [selectedConcert]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Upcoming Concerts
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the best of Nepali music culture. Book your tickets now for unforgettable performances.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Secure Booking
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Instant Confirmation
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Global Access
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(loading || concerts.length === 0)
            ? Array.from({ length: 6 }).map((_, idx) => (
                <ConcertCardShimmer key={idx} />
              ))
            : concerts.map(concert => (
                <ConcertCard
                  key={concert.id}
                  concert={concert}
                  tiers={ticketTiers.filter(tier => tier.concertId === concert.id)}
                  onBookNow={handleBookNow}
                />
              ))}
        </div>
      </main>
      {selectedConcert && (
        <BookingModal
          concert={selectedConcert}
          tiers={ticketTiers.filter(tier => tier.concertId === selectedConcert.id)}
          onClose={handleCloseModal}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
