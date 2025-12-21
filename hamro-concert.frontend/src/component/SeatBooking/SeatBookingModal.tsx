/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { type Concert, type TicketTier } from "../../types";
import { getSeatsByConcert, bookSeats, type Seat, type SeatBookingRequest } from "../../api/seats";
import ButtonWrapper from "../ButtonWrapper/ButtonWrapper";
import SeatBookingHeader from "./SeatBookingHeader";
import SeatSelection from "./SeatSelection";
import SeatBookingConfirm from "./SeatBookingConfirm";
import SeatTotal from "./SeatTotal";
import UserEmailInput from "./UserEmailInput";
import { queryClient } from "../../lib/queryClient";

interface SeatBookingModalProps {
  concert: Concert;
  ticketTiers: TicketTier[];
  onClose: () => void;
}

function SeatBookingModal({ concert, ticketTiers, onClose }: SeatBookingModalProps) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const seatData = await getSeatsByConcert(concert.id);
        setSeats(seatData.seats);
        setError(null);
      } catch (err) {
        setError("Failed to load seats. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [concert.id]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) return;
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSeats.length === 0) return;
    if (!userName || !userEmail) return;

    try {
      setIsBooking(true);
      const bookingData: SeatBookingRequest = {
        userName,
        userEmail,
        seatIds: selectedSeats.map(seat => seat.id),
      };
      
      await bookSeats(bookingData);
       // Refresh cached lists
    queryClient.invalidateQueries({ queryKey: ['concerts'] });
    queryClient.invalidateQueries({ queryKey: ['ticketTiers'] });
      setIsBooked(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to book seats. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const resetForm = () => {
    setSelectedSeats([]);
    setUserName("");
    setUserEmail("");
    setIsBooked(false);
    setError(null);
  };

  if (isBooked) {
    return <SeatBookingConfirm userEmail={userEmail} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="theme-bg-surface theme-shadow-modal theme-radius-2xl max-w-5xl w-full my-8 max-h-[95vh] overflow-hidden flex flex-col">
        <SeatBookingHeader concert={concert} onClose={onClose} />
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleBooking} className="p-6 space-y-6">
            <SeatSelection 
              seats={seats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
              loading={loading}
              error={error}
            />

            {/* Selected seats summary */}
            {selectedSeats.length > 0 && (
              <div className="theme-bg-secondary-50 border-2 theme-border-primary-200 theme-radius-lg p-4">
                <h4 className="font-bold theme-text-primary mb-3">Selected Seats:</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedSeats.map(seat => (
                    <span key={seat.id} className="px-3 py-1 theme-bg-primary-100 theme-text-primary-700 theme-radius-full text-sm font-medium">
                      {seat.seatNumber}
                    </span>
                  ))}
                </div>
                <div className="text-lg font-bold theme-text-primary">
                  Total Seats: {selectedSeats.length}
                </div>
              </div>
            )}

            <SeatTotal 
              selectedSeats={selectedSeats}
              ticketTiers={ticketTiers}
            />

            <div className="theme-bg-surface border-2 theme-border-primary-200 theme-radius-lg p-6">
              <UserEmailInput
                userName={userName}
                setUserName={setUserName}
                userEmail={userEmail}
                setUserEmail={setUserEmail}
              />
              
              <div className="mt-6">
                <ButtonWrapper
                  type="submit"
                  disabled={selectedSeats.length === 0 || !userName || !userEmail || isBooking}
                  className="w-full font-bold py-4 px-6 theme-radius-lg text-lg"
                >
                  {isBooking ? "Booking..." : `Book ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? "s" : ""}`}
                </ButtonWrapper>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 theme-radius-lg">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SeatBookingModal;
