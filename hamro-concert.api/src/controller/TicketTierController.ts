/* eslint-disable no-unused-vars */
import { Request, Response } from "express";
import { TicketTierService } from "../services/TicketTierService";
import { PaginatedResult } from "../helper/pagination";
import { TicketTierVM } from "../viewmodel/TicketTierVM";

export class TicketTierController {
  constructor(private service: TicketTierService) {}

  create = async (req: Request, res: Response) => {
    try {
      const created = await this.service.create(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result: PaginatedResult<TicketTierVM> = await this.service.getAll(page, limit);
    res.json(result);
  };


  getAllNoPaginate = async (_req: Request, res: Response) => {
    const result = await this.service.getAllNoPaginate();
    res.json(result);
  };

  getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const item = await this.service.getById(id);
    if (!item) return res.status(404).json({ message: "Ticket tier not found" });
    res.json(item);
  };

  update = async (req: Request, res: Response) => {
    const updated = await this.service.update(req.body);
    if (!updated) return res.status(404).json({ message: "Ticket tier not found" });
    res.json(updated);
  };

  delete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.service.delete(id);
    res.status(204).send();
  };
}
