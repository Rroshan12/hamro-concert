import React from "react";

const UpCommingInfo = React.memo(function UpCommingInfo() {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Upcoming Concerts
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Experience the best of Nepali music culture. Book your tickets now for
        unforgettable performances.
      </p>
      <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          Secure Booking
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          Instant Confirmation
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          Global Access
        </div>
      </div>
    </div>
  );
});

export default UpCommingInfo;
