// src/routes/concert.routes.ts
import { Router } from "express";
import { ConcertController } from "../controller/ConcertController";
import { ConcertService } from "../services/ConcertService";
import { ConcertRepository } from "../repository/ConcertRepository";

const router = Router();

const concertRepo = new ConcertRepository();
const concertService = new ConcertService(concertRepo);
const concertController = new ConcertController(concertService);

router.post("/", concertController.create);
router.get("/", concertController.getAll);
router.get("/:id", concertController.getById);
router.put("/:id", concertController.update);
router.delete("/:id", concertController.delete);

export default router;
