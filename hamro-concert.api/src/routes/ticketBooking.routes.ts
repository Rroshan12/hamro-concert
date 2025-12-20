import { Router } from "express";
import { TicketBookingController } from "../controller/TicketBookingController";
import { TicketBookingService } from "../services/TicketBookingService";

const router = Router();

const service = new TicketBookingService();
const controller = new TicketBookingController(service);

router.post("/", controller.create);

export default router;
