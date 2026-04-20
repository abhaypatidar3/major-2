import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getJustdialGynaecologists } from "../controllers/gynaecologistController.js";

const router = express.Router();

router.get("/justdial", isAuthenticated, getJustdialGynaecologists);

export default router;
