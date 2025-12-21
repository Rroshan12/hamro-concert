/* eslint-env node */
/* eslint-disable no-console, no-undef */
import axios from "axios";

async function main() {
  const baseURL = "http://localhost:3000";
  const client = axios.create({ baseURL, validateStatus: () => true });

  // Get available concerts
  const concerts = await client.get("/concerts");
  if (!concerts.data?.data?.length) {
    console.error("No concerts available to test");
    process.exit(1);
  }
  const concert = concerts.data.data[0];
  const concertId = concert.id;

  // Get seats for the concert
  const seatsResponse = await client.get(`/seats/concert/${concertId}`);
  const availableSeats = seatsResponse.data?.seats?.filter(seat => !seat.isBooked).slice(0, 2);
  if (!availableSeats || availableSeats.length < 2) {
    console.error("Less than 2 available seats to test");
    process.exit(1);
  }

  const [seat1, seat2] = availableSeats;
  console.log(`Testing concurrent booking for seat IDs: ${seat1.id} and ${seat2.id}`);

  // Prepare booking payloads for each seat
  const bookingPayload1 = {
    userName: "Concurrent Tester 1",
    userEmail: `seat_tester_${seat1.id}_${Date.now()}@example.com`,
    seatIds: [seat1.id]
  };

  const bookingPayload2 = {
    userName: "Concurrent Tester 2",
    userEmail: `seat_tester_${seat2.id}_${Date.now()}@example.com`,
    seatIds: [seat2.id]
  };

  // Send two parallel requests for different seats
  const [r1, r2] = await Promise.all([
    client.post("/ticket-bookings/seats", bookingPayload1),
    client.post("/ticket-bookings/seats", bookingPayload2)
  ]);

  // Check results
  const finalSeatsResponse = await client.get(`/seats/concert/${concertId}`);
  const finalSeat1 = finalSeatsResponse.data.seats.find(seat => seat.id === seat1.id);
  const finalSeat2 = finalSeatsResponse.data.seats.find(seat => seat.id === seat2.id);

  console.log(`Seat ${seat1.id} booked: ${finalSeat1?.isBooked}`);
  console.log(`Seat ${seat2.id} booked: ${finalSeat2?.isBooked}`);

  console.log("Booking test for two different seats completed");
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
