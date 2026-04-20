import express from "express";
import {
  getAllSymptoms,
  getSymptomById,
} from "../controllers/symptomController.js";

const router = express.Router();

router.get("/", getAllSymptoms);
router.get("/:id", getSymptomById);

export default router;
