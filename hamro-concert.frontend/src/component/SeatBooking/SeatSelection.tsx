import { type Seat } from "../../api/seats";

type SeatSelectionProps = {
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatClick: (seat: Seat) => void;
  loading: boolean;
  error: string | null;
};

function SeatSelection({ seats, selectedSeats, onSeatClick, loading, error }: SeatSelectionProps) {
  const getSeatColor = (seat: Seat) => {
    if (seat.isBooked) return "bg-red-500 cursor-not-allowed";
    if (selectedSeats.some(s => s.id === seat.id)) return "bg-blue-500 cursor-pointer";
    return "bg-green-500 cursor-pointer hover:bg-green-600";
  };

  const renderSection = (section: "front" | "vip" | "ga", title: string) => {
    const sectionSeats = seats.filter(s => s.section === section);
    const rows = Math.max(...sectionSeats.map(s => s.row), 0);

    return (
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4 theme-text-primary">{title}</h3>
        <div className="space-y-2">
          {sectionSeats.length === 0 ? (
            <div className="text-center py-4 theme-text-secondary">
              No seats available in this section
            </div>
          ) : (
            Array.from({ length: rows }, (_, rowIndex) => {
              const rowSeats = sectionSeats.filter(s => s.row === rowIndex + 1);
              // Sort seats by seat number in ascending order
              const sortedSeats = [...rowSeats].sort((a, b) => {
                const seatNumA = parseInt(a.seatNumber.split("-")[1]);
                const seatNumB = parseInt(b.seatNumber.split("-")[1]);
                return seatNumA - seatNumB;
              });
              return (
                <div key={rowIndex} className="flex justify-center space-x-2">
                  {sortedSeats.map(seat => (
                    <button
                      key={seat.id}
                      onClick={() => onSeatClick(seat)}
                      className={`w-8 h-8 text-xs font-medium rounded transition-colors ${getSeatColor(seat)}`}
                      title={`${seat.section.toUpperCase()} - Row ${seat.row} - Seat ${seat.seatNumber}`}
                      disabled={seat.isBooked}
                    >
                      {seat.seatNumber.split("-")[1]}
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 theme-text-secondary">Loading seats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Legend */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4 theme-text-primary">Seat Selection</h3>
        <div className="flex space-x-6 mb-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="theme-text-secondary">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span className="theme-text-secondary">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="theme-text-secondary">Booked</span>
          </div>
        </div>
      </div>

      {/* Stage indicator */}
      <div className="mb-6 text-center">
        <div className="theme-gradient-primary text-white py-2 px-4 rounded-lg font-bold">
          STAGE
        </div>
      </div>

      {/* Seat sections */}
      <div className="theme-bg-secondary-50 rounded-lg p-4 theme-border">
        {renderSection("front", "Front Section")}
        {renderSection("vip", "VIP Section")}
        {renderSection("ga", "General Admission")}
      </div>
    </div>
  );
}

export default SeatSelection;
