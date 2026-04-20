import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getProfile);
router.put("/profile", isAuthenticated, updateProfile);

export default router;
