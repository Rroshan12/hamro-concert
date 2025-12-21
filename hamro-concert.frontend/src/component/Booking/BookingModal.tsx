/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { type Concert, type TicketTier } from "../../types";
import Confirm from "./Confirm";
import TicketTotal from "./TicketTotal";
import UserEmailInput from "./UserEmailInput";
import BookingModalHeader from "./BookingModalHeader";
import TicketSelection from "./TicketSelection";
import { createBooking, type CreateBookingPayload } from "../../api/bookings";
import { useQueryClient } from "@tanstack/react-query";

interface BookingModalProps {
  concert: Concert | null;
  tiers: TicketTier[];
  onClose: () => void;
}

export default function BookingModal({
  concert,
  tiers,
  onClose,
}: BookingModalProps) {
  const queryClient = useQueryClient();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  
  const updateQuantity = (tierId: string, change: number) => {
    setQuantities((prev) => {
      const tierIdStr = tierId;
      const currentQty = prev[tierIdStr] || 0;
      const newQty = Math.max(0, currentQty + change);
      const tier = tiers.find((t) => t.id === tierId);
      return {
        ...prev,
        [tierIdStr]: tier ? Math.min(newQty, tier.available) : newQty,
      };
    });
  };

  const totalAmount = tiers.reduce((sum, tier) => {
    const qty = quantities[tier.id] || 0;
    return sum + qty * tier.price;
  }, 0);

  const totalTickets = Object.values(quantities).reduce(
    (sum, qty) => sum + qty,
    0
  );

const handleBooking = async (e: React.FormEvent) => {
  e.preventDefault();

  if (totalTickets > 0 && userName && userEmail) {
    const bookingPayload: CreateBookingPayload = {
      userName,
      userEmail,
      ticketData: Object.entries(quantities)
        .filter(([, quantity]) => quantity > 0)
        .map(([ticketTierId, quantity]) => ({
          ticketTierId: Number(ticketTierId),
          quantity,
        })),
    };
    await createBooking(bookingPayload);
    // Refresh cached lists
    queryClient.invalidateQueries({ queryKey: ['concerts'] });
    queryClient.invalidateQueries({ queryKey: ['ticketTiers'] });
    setIsBooked(true);
    setTimeout(() => {
      onClose();
      setIsBooked(false);
      setQuantities({});
      setUserName("");
      setUserEmail("");
    }, 3000);
  }
};

  if (isBooked) {
    return <Confirm userEmail={userEmail} />;
  }

  return (
   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="theme-bg-surface theme-shadow-modal theme-radius-2xl max-w-2xl w-full my-8">
        <BookingModalHeader concert={concert!} onClose={onClose} />
        <form onSubmit={handleBooking} className="p-6">
          <TicketSelection 
            tiers={tiers} 
            quantities={quantities} 
            updateQuantity={updateQuantity} 
          />
          <UserEmailInput
            userName={userName}
            setUserName={setUserName}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
          />
          <TicketTotal totalTickets={totalTickets} totalAmount={totalAmount} />

          <button
            type="submit"
            disabled={totalTickets === 0 || !userName || !userEmail}
            className="w-full theme-gradient-primary text-white font-bold py-4 px-6 theme-radius-lg theme-transition transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
          >
            {totalTickets === 0
              ? "Select Tickets"
              : `Confirm Booking - $${totalAmount}`}
          </button>
        </form>
      </div>
    </div>
  );
}
