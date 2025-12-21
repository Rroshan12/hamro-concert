/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { TypeId, type Concert, type TicketTier } from "../../types";
import Confirm from "./Confirm";
import TicketTotal from "./TicketTotal";
import UserEmailInput from "./UserEmailInput";
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
      const currentQty = prev[tierId] || 0;
      const newQty = Math.max(0, currentQty + change);
      const tier = tiers.find((t) => t.id === tierId);
      return {
        ...prev,
        [tierId]: tier ? Math.min(newQty, tier.available) : newQty,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">{concert.title}</h2>
              <p className="text-red-100">{concert.artist}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <form onSubmit={handleBooking} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-red-600" />
              Select Tickets
            </h3>
            <div className="space-y-4">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {TypeId[`${tier.ticketTypeId}`]}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {tier.available} available
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">
                        ${tier.price}
                      </p>
                      <p className="text-xs text-gray-500">per ticket</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Quantity:
                    </span>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(tier.id, -1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 transition-colors"
                        disabled={!quantities[tier.id]}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {quantities[tier.id] || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(tier.id, 1)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                        disabled={(quantities[tier.id] || 0) >= tier.available}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
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
