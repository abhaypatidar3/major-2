import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getDoctors } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", isAuthenticated, getDoctors);

export default router;