/* eslint-disable no-unused-vars */
import { Request, Response } from "express";
import { TicketBookingService } from "../services/TicketBookingService";

export class TicketBookingController {
  constructor(private service: TicketBookingService) {}

  bookSeats = async (req: Request, res: Response) => {
    try {
      const { userName, userEmail, seatIds } = req.body;
      
      if (!Array.isArray(seatIds) || seatIds.length === 0) {
        return res.status(400).json({ message: "seatIds must be a non-empty array" });
      }

      const created = await this.service.bookSeats({ userName, userEmail, seatIds });
      res.status(201).json(created);
    } catch (err: any) {
      res.status(err.status || 400).json({ message: err.message });
    }
  };
}
