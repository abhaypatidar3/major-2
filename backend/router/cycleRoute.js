import express from "express";
import {
  saveCycleLog,
  getCycleLogs,
  deleteCycleLog,
} from "../controllers/cycleController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/log", isAuthenticated, saveCycleLog);
router.get("/logs", isAuthenticated, getCycleLogs);
router.delete("/log/:id", isAuthenticated, deleteCycleLog);

export default router;
