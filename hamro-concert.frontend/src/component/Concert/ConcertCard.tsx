import React from "react";
import { type Concert, type TicketTier } from "../../types";
import CardWrapper from "../CardWrapper/CardWrapper";
import ConcertImage from "./ConcertImage";
import ConcertInfo from "./ConcertInfo";
import ConcertDetails from "./ConcertDetails";
import TicketTiers from "./TicketTiers";
import ButtonWrapper from "../ButtonWrapper/ButtonWrapper";

interface ConcertCardProps {
  concert: Concert;
  tiers: TicketTier[];
  onBookSeat: (concert: Concert) => void;
}

const ConcertCard = React.memo(function ConcertCard({
  concert,
  tiers,
  onBookSeat,
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

        <div className="flex justify-center">
          <ButtonWrapper onClick={() => onBookSeat(concert)} type="button">
            Book Seats
          </ButtonWrapper>
        </div>
      </div>
    </CardWrapper>
  );
});

export default ConcertCard;
