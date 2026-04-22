import express from "express";
import { getRiskPrediction } from "../controllers/riskController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/predict", isAuthenticated, getRiskPrediction);

export default router;
