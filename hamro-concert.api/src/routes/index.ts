
import { Router } from "express";
import concertRoutes from "./concert.routes";
import ticketTierRoutes from "./ticketTier.routes";
import ticketBookingRoutes from "./ticketBooking.routes";
import seatRoutes from "./seat.routes";


const router = Router();

router.use("/concerts", concertRoutes);
router.use("/ticket-tiers", ticketTierRoutes);
router.use("/ticket-bookings", ticketBookingRoutes);
router.use("/seats", seatRoutes);


export default router;
