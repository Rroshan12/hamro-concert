import { Request, Response } from "express";
import { SeatService } from "../services/SeatService";

export class SeatController {
  constructor(private seatService: SeatService) {}

  // Get all seats for a specific concert
  async getSeatsByConcert(req: Request, res: Response) {
    try {
      const { concertId } = req.params;
      if (!concertId) {
        return res.status(400).json({ error: "Concert ID is required" });
      }

      const seats = await this.seatService.getSeatsByConcert(concertId);
      res.json(seats);
    } catch (error) {
      console.error("Error fetching seats:", error);
      res.status(500).json({ error: "Failed to fetch seats" });
    }
  }

  // Get available seats for a specific concert
  async getAvailableSeatsByConcert(req: Request, res: Response) {
    try {
      const { concertId } = req.params;
      
            console.log(concertId,'jjj')
      if (!concertId) {
        return res.status(400).json({ error: "Concert ID is required" });
      }

      const seats = await this.seatService.getAvailableSeatsByConcert(concertId);
      res.json(seats);
    } catch (error) {
      console.error("Error fetching available seats:", error);
      res.status(500).json({ error: "Failed to fetch available seats" });
    }
  }
}
