// src/routes/index.ts
import { Router } from "express";
import concertRoutes from "./concert.routes";
// import other routes here if needed
// import userRoutes from "./user.routes";

const router = Router();

router.use("/concerts", concertRoutes);
// router.use("/users", userRoutes); // add more routes as needed

export default router;
