import { Calendar, Clock, MapPin } from "lucide-react";

type ConcertDetailsProps = {
  date: string;
  time: string;
  venue: string;
  city: string;
};

function ConcertDetails({ date, time, venue, city }: ConcertDetailsProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center theme-text-muted">
        <Calendar className="h-4 w-4 mr-2 cursor-pointer theme-text-primary-600" />
        <span className="text-sm">{formatDate(date)}</span>
      </div>
      <div className="flex items-center theme-text-muted">
        <Clock className="h-4 w-4 mr-2 cursor-pointer theme-text-primary-600" />
        <span className="text-sm">{time}</span>
      </div>
      <div className="flex items-center theme-text-muted">
        <MapPin className="h-4 w-4 mr-2 cursor-pointer theme-text-primary-600" />
        <span className="text-sm">
          {venue}, {city}
        </span>
      </div>
    </div>
  );
}

export default ConcertDetails;
