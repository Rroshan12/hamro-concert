import { Minus, Plus, ShoppingCart } from "lucide-react";
import { TypeId, type TicketTier } from "../../types";

type TicketSelectionProps = {
  tiers: TicketTier[];
  quantities: Record<string, number>;
  updateQuantity: (tierId: string, change: number) => void;
};

function TicketSelection({ tiers, quantities, updateQuantity }: TicketSelectionProps) {

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ShoppingCart className="h-5 w-5 mr-2 text-red-600" />
        Select Tickets
      </h3>
      <div className="space-y-4">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-gray-900">
                  {TypeId[String(tier.ticketTypeId) as keyof typeof TypeId]}
                </h4>
                <p className="text-sm text-gray-500">
                  {tier.available} available
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">
                  ${tier.price}
                </p>
                <p className="text-xs text-gray-500">per ticket</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Quantity:
              </span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => updateQuantity(tier.id, -1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 transition-colors cursor-pointer"
                  disabled={!quantities[String(tier.id)]}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-semibold w-8 text-center">
                  {quantities[String(tier.id)] || 0}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(tier.id, 1)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors cursor-pointer"
                  disabled={(quantities[String(tier.id)] || 0) >= tier.available}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TicketSelection;
