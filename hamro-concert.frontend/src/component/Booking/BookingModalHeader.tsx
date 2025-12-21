import { X } from "lucide-react";
import { type Concert } from "../../types";

type BookingModalHeaderProps = {
  concert: Concert;
  onClose: () => void;
};

function BookingModalHeader({ concert, onClose }: BookingModalHeaderProps) {
  return (
    <div className="theme-gradient-primary text-white p-6 rounded-t-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">{concert.title}</h2>
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

export default BookingModalHeader;
