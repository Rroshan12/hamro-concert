import { type Seat } from "../../api/seats";
import { type TicketTier } from "../../types";

type SeatTotalProps = {
  selectedSeats: Seat[];
  ticketTiers: TicketTier[];
};

function SeatTotal({ selectedSeats, ticketTiers }: SeatTotalProps) {
  const totalSeats = selectedSeats.length;
  
  const totalAmount = selectedSeats.reduce((sum, seat) => {
    // Convert ticket tier ID to number for comparison
    const matchingTier = ticketTiers.find(tier => parseInt(tier.id, 10) === seat.ticketTierId);
    const price = matchingTier?.price || 0;
    return Number(sum) + Number(price);
  }, 0);

  if (totalSeats === 0) return null;

  return (
    <div className="theme-bg-secondary-50 border-2 theme-border-primary-200 theme-radius-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="theme-text-secondary font-medium">Total Seats:</span>
        <span className="text-xl font-bold theme-text-primary">{totalSeats}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="theme-text-secondary font-medium">Total Amount:</span>
        <span className="text-2xl font-bold theme-text-primary-600">
          ${totalAmount} USD
        </span>
      </div>
    </div>
  );
}

export default SeatTotal;
