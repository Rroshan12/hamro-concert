import { Users } from "lucide-react";
import { TypeId, type TicketTier } from "../../types";

type TicketTiersProps = {
  tiers: TicketTier[];
};

function TicketTiers({ tiers }: TicketTiersProps) {
  return (
    <div className="pt-4 mb-4 theme-border" style={{ borderTop: '1px solid' }}>
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
                {TypeId[String(tier.ticketTypeId) as keyof typeof TypeId]}
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
  );
}

export default TicketTiers;
