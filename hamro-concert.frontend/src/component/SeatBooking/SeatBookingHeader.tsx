import { X } from "lucide-react";
import { type Concert } from "../../types";

type SeatBookingHeaderProps = {
  concert: Concert;
  onClose: () => void;
};

function SeatBookingHeader({ concert, onClose }: SeatBookingHeaderProps) {
  return (
    <div className="theme-gradient-primary text-white p-6 rounded-t-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Select Seats - {concert.title}</h2>
          <p className="text-red-100">{concert.artist}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default SeatBookingHeader;
