import express from "express";
import { chatWithAI } from "../controllers/aiController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/chat", isAuthenticated, chatWithAI);

export default router;