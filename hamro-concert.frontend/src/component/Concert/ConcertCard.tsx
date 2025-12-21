import React from "react";
import { type Concert, type TicketTier } from "../../types";
import CardWrapper from "../CardWrapper/CardWrapper";
import ConcertImage from "./ConcertImage";
import ConcertInfo from "./ConcertInfo";
import ConcertDetails from "./ConcertDetails";
import TicketTiers from "./TicketTiers";

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

  return (
    <CardWrapper>
      <ConcertImage 
        image={concert.image} 
        title={concert.title} 
        totalAvailable={totalAvailable} 
      />
      
      <div className="p-6">
        <ConcertInfo 
          title={concert.title}
          artist={concert.artist}
          description={concert.description}
        />
        
        <ConcertDetails 
          date={concert.date}
          time={concert.time}
          venue={concert.venue}
          city={concert.city}
        />
        
        <TicketTiers tiers={tiers} />

        <button
          onClick={() => onBookNow(concert)}
          className="w-full theme-gradient-primary text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
        >
          Book Tickets Now
        </button>
      </div>
    </CardWrapper>
  );
});

export default ConcertCard;
