import React from "react";

type TicketTotalProps = {
  totalTickets: number,
  totalAmount: number
}

function TicketTotal({totalTickets, totalAmount}:TicketTotalProps) {
  return (
    <div className="theme-bg-secondary-50 border-2 theme-border-primary-200 theme-radius-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="theme-text-secondary font-medium">Total Tickets:</span>
        <span className="text-xl font-bold theme-text-primary">{totalTickets}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="theme-text-secondary font-medium">Total Amount:</span>
        <span className="text-2xl font-bold theme-text-primary-600">
          ${totalAmount} USD
        </span>
      </div>
    </div>
  );
}

export default TicketTotal;
