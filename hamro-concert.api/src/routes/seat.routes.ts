import { Router } from "express";
import { SeatController } from "../controller/SeatController";
import { SeatService } from "../services/SeatService";

const router = Router();
const seatService = new SeatService();
const seatController = new SeatController(seatService);

// GET /api/seats/concert/:concertId/available - Get available seats for a concert (more specific route first)
router.get("/concert/:concertId/available", (req, res) => 
  seatController.getAvailableSeatsByConcert(req, res)
);

// GET /api/seats/concert/:concertId - Get all seats for a concert
router.get("/concert/:concertId", (req, res) => 
  seatController.getSeatsByConcert(req, res)
);

export default router;
