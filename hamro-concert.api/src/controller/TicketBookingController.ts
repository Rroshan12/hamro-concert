/* eslint-disable no-unused-vars */
import { Request, Response } from "express";
import { TicketBookingService } from "../services/TicketBookingService";
import { TicketBookingVM } from "../viewmodel/TicketBookingVM";

export class TicketBookingController {
  constructor(private service: TicketBookingService) {}

  create = async (req: Request, res: Response) => {
    try {
      const { userName, userEmail, ticketData } = req.body as TicketBookingVM;
      if (!Array.isArray(ticketData) || ticketData.length === 0) {
        return res.status(400).json({ message: "ticketData must be a non-empty array" });
      }
      const items = ticketData.map((i) => ({
        ticketTierId: Number(i.ticketTierId),
        quantity: Number(i.quantity),
      }));
      const created = await this.service.create({ userName, userEmail, ticketData: items });
      res.status(201).json(created);
    } catch (err: any) {
      res.status(err.status || 400).json({ message: err.message });
    }
  };
}
