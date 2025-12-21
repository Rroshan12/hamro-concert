import React from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { TypeId, type Concert, type TicketTier } from "../types";

interface ConcertCardProps {
  concert: Concert;
  tiers: TicketTier[];
  onBookNow: (concert: Concert) => void;
}

const ConcertCard = React.memo(function ConcertCard({
  concert,
  tiers,
  onBookNow,
}: ConcertCardProps) {
  const totalAvailable = tiers.reduce((sum, tier) => sum + tier.available, 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-orange-100">
      <div className="relative">
        <img
          src={concert.image}
          alt={concert.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {totalAvailable} tickets left
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {concert.title}
        </h3>
        <p className="text-red-700 font-semibold text-lg mb-3">
          {concert.artist}
        </p>
        <p className="text-gray-600 text-sm mb-4">
          {concert.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-700">
            <Calendar className="h-4 w-4 mr-2 text-red-600" />
            <span className="text-sm">{formatDate(concert.date)}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="h-4 w-4 mr-2 text-red-600" />
            <span className="text-sm">{concert.time}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin className="h-4 w-4 mr-2 text-red-600" />
            <span className="text-sm">
              {concert.venue}, {concert.city}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Ticket Tiers
            </span>
          </div>
          <div className="space-y-2">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-2 text-gray-400" />
                  <span className="font-medium text-gray-700">
                    {TypeId[`${tier.ticketTypeId}`]}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-600 font-semibold">
                    ${tier.price}
                  </span>
                  <span className="text-gray-500">
                    {tier.available}/{tier.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => onBookNow(concert)}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          Book Tickets Now
        </button>
      </div>
    </div>
  );
});

export default ConcertCard;
