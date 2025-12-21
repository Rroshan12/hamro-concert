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
    <div className="theme-bg-surface shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 theme-border-primary-100">
      <div className="relative">
        <img
          src={concert.image}
          alt={concert.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 theme-bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          {totalAvailable} tickets left
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 theme-text-primary">
          {concert.title}
        </h3>
        <p className="font-semibold text-lg mb-3 theme-text-primary-700">
          {concert.artist}
        </p>
        <p className="text-sm mb-4 theme-text-secondary">
          {concert.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center theme-text-muted">
            <Calendar className="h-4 w-4 mr-2 cursor-pointer theme-text-primary-600" />
            <span className="text-sm">{formatDate(concert.date)}</span>
          </div>
          <div className="flex items-center theme-text-muted">
            <Clock className="h-4 w-4 mr-2 cursor-pointer theme-text-primary-600" />
            <span className="text-sm">{concert.time}</span>
          </div>
          <div className="flex items-center theme-text-muted">
           <MapPin className="h-4 w-4 mr-2 cursor-pointer theme-text-primary-600" />
            <span className="text-sm">
              {concert.venue}, {concert.city}
            </span>
          </div>
        </div>

        <div className="pt-4 mb-4 theme-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase theme-text-muted">
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
                  <Users className="h-3 w-3 mr-2 cursor-pointer theme-text-muted" />
                  <span className="font-medium theme-text-secondary">
                    {TypeId[`${tier.ticketTypeId}`]}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold theme-text-success">
                    ${tier.price}
                  </span>
                  <span className="font-semibold theme-text-muted">
                    {tier.available}/{tier.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => onBookNow(concert)}
          className="w-full theme-gradient-primary text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
        >
          Book Tickets Now
        </button>
      </div>
    </div>
  );
});

export default ConcertCard;
