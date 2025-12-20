/* eslint-disable no-unused-vars */
import { Request, Response } from "express";
import { ConcertService } from "../services/ConcertService";

export class ConcertController {
  constructor(private concertService: ConcertService) {}

  create = async (req: Request, res: Response) => {
    try {
      const concert = await this.concertService.createConcert(req.body);
      res.status(201).json(concert);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getAll = async (_req: Request, res: Response) => {
    const concerts = await this.concertService.getConcerts();
    res.json(concerts);
  };

  getById = async (req: Request, res: Response) => {
    const concert = await this.concertService.getConcertById(req.params.id);
    if (!concert) return res.status(404).json({ message: "Concert not found" });
    res.json(concert);
  };

  update = async (req: Request, res: Response) => {
    const concert = await this.concertService.updateConcert(req.body);
    if (!concert) return res.status(404).json({ message: "Concert not found" });
    res.json(concert);
  };

  delete = async (req: Request, res: Response) => {
    await this.concertService.deleteConcert(req.params.id);
    res.status(204).send();
  };
}
