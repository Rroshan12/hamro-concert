
import { Router } from "express";
import { TicketTierController } from "../controller/TicketTierController";
import { TicketTierService } from "../services/TicketTierService";
import { TicketTierRepository } from "../repository/TicketTierRepository";

const router = Router();

const repo = new TicketTierRepository();
const service = new TicketTierService(repo);
const controller = new TicketTierController(service);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/all", controller.getAllNoPaginate);
router.get("/:id", controller.getById);
router.put("/", controller.update);
router.delete("/:id", controller.delete);

export default router;
