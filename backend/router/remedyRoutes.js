import express from "express";
import { getRemedySuggestions } from "../controllers/remedyController.js";

const router = express.Router();

router.post("/suggest", getRemedySuggestions);

export default router;
