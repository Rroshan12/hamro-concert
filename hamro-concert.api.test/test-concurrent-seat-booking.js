/* eslint-env node */
/* eslint-disable no-console, no-undef */
import axios from "axios";

async function main() {
  const baseURL = "http://localhost:3000";
  const client = axios.create({ baseURL, validateStatus: () => true });

  // Get available seats for a concert
  const concerts = await client.get("/concerts");
  if (!concerts.data || !concerts.data.data || concerts.data.data.length === 0) {
    console.error("No concerts available to test");
    process.exit(1);
  }
  const concert = concerts.data.data[0];
  const concertId = concert.id;

  // Get seats for the concert
  const seatsResponse = await client.get(`/seats/concert/${concertId}`);
  if (!seatsResponse.data || !seatsResponse.data.seats || seatsResponse.data.seats.length === 0) {
    console.error("No seats available to test");
    process.exit(1);
  }

  // Find an available seat
  const availableSeat = seatsResponse.data.seats.find(seat => !seat.isBooked);
  if (!availableSeat) {
    console.error("No available seats to test");
    process.exit(1);
  }

  const seatId = availableSeat.id;
  console.log(`Testing concurrent booking for seat ID: ${seatId}`);

  // Prepare booking payload
  const bookingPayload = {
    userName: "Concurrent Seat Tester",
    userEmail: `seat_tester_${Date.now()}@example.com`,
    seatIds: [seatId]
  };

  // Make two parallel requests to book the same seat
  const [r1, r2] = await Promise.all([
    client.post("/ticket-bookings/seats", bookingPayload),
    client.post("/ticket-bookings/seats", bookingPayload)
  ]);

  const successCount = [r1, r2].filter((r) => r.status === 201).length;
  const failCount = [r1, r2].filter((r) => r.status !== 201).length;

  // Check final seat status
  const finalSeatResponse = await client.get(`/seats/concert/${concertId}`);
  const finalSeat = finalSeatResponse.data.seats.find(seat => seat.id === seatId);
  const finalSeatBooked = finalSeat?.isBooked || false;

  // Test should pass: exactly one booking succeeds and seat is booked
  const pass = successCount === 1 && failCount === 1 && finalSeatBooked;
  
  if (!pass) {
    console.error(
      JSON.stringify(
        {
          seatId,
          r1: { status: r1.status, data: r1.data },
          r2: { status: r2.status, data: r2.data },
          successCount,
          failCount,
          finalSeatBooked
        },
        null,
        2
      )
    );
    process.exit(1);
  }

  console.log("Concurrent seat booking test passed");
  console.log(`- One booking succeeded (status 201)`);
  console.log(`- One booking failed (status ${[r1, r2].find(r => r.status !== 201)?.status})`);
  console.log(`- Seat ${seatId} is now booked`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
