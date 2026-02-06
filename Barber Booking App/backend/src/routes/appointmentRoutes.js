import express from "express";
import {
  getAllAppointments,
  createAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// Alle routes hieronder checken eerst token
router.use(requireAuth);

router.get("/", getAllAppointments);
router.post("/", createAppointment);
router.delete("/:id", deleteAppointment);

export default router;
