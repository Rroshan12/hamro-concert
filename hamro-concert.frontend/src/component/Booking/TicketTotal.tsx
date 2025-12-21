import React from "react";

type TicketTotalProps = {
  totalTickets: number,
  totalAmount: number
}

function TicketTotal({totalTickets, totalAmount}:TicketTotalProps) {
  return (
    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-700 font-medium">Total Tickets:</span>
        <span className="text-xl font-bold text-gray-900">{totalTickets}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-700 font-medium">Total Amount:</span>
        <span className="text-2xl font-bold text-red-600">
          ${totalAmount} USD
        </span>
      </div>
    </div>
  );
}

export default TicketTotal;
