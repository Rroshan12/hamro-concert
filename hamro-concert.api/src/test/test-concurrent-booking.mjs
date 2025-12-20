/* eslint-env node */
/* eslint-disable no-console, no-undef */
import axios from "axios";

async function main() {
  const baseURL = "http://localhost:3000";
  const client = axios.create({ baseURL, validateStatus: () => true });

  const tiers = await client.get("/ticket-tiers", { params: { page: 1, limit: 1 } });
  if (!tiers.data || !tiers.data.data || tiers.data.data.length === 0) {
    console.error("No ticket tiers available to test");
    process.exit(1);
  }
  const tier = tiers.data.data[0];
  const tierId = tier.id || tier.ticketTierId || tier.ticket_tier_id || tier["id"];

  const tierDetail = await client.get(`/ticket-tiers/${tierId}`);
  if (tierDetail.status !== 200) {
    console.error("Failed to fetch tier detail", tierDetail.status, tierDetail.data);
    process.exit(1);
  }
  const body = tierDetail.data;

  const reset = await client.put(`/ticket-tiers`, {
    ...body,
    id: tierId,
    total: Math.max(Number(body.total || 2), 2),
    available: 2,
  });
  if (reset.status < 200 || reset.status >= 300) {
    console.error("Failed to reset tier availability", reset.status, reset.data);
    process.exit(1);
  }

  const bookingPayload = {
    userName: "Concurrent Tester",
    userEmail: `tester_${Date.now()}@example.com`,
    ticketData: [{ ticketTierId: tierId, quantity: 2 }],
  };

  const [r1, r2] = await Promise.all([
    client.post("/ticket-bookings", bookingPayload),
    client.post("/ticket-bookings", bookingPayload),
  ]);

  const successCount = [r1, r2].filter((r) => r.status === 201).length;
  const failCount = [r1, r2].filter((r) => r.status !== 201).length;
  
  const finalTier = await client.get(`/ticket-tiers/${tierId}`);
  const finalAvailable = Number(finalTier.data?.available ?? -1);

  const pass = successCount === 1 && failCount === 1 && finalAvailable === 0;
  if (!pass) {
    console.error(
      JSON.stringify(
        {
          r1: { status: r1.status, data: r1.data },
          r2: { status: r2.status, data: r2.data },
          finalAvailable,
        },
        null,
        2
      )
    );
    process.exit(1);
  }

  console.log("Concurrent booking test passed");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
