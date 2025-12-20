
import { Router } from "express";
import concertRoutes from "./concert.routes";
import ticketTierRoutes from "./ticketTier.routes";


const router = Router();

router.use("/concerts", concertRoutes);
router.use("/ticket-tiers", ticketTierRoutes);


export default router;
