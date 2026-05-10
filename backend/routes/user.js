import express from "express";
import {
  getProfile,
  aiAnalysis,
  saveSteps,
  getSteps,
  updateFcmToken,
  getDashboard,
  updateProfile,
  addMeal,
  getTodaysMeals,
  getProgress
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/dashboard', authMiddleware, getDashboard);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/meals', authMiddleware, addMeal);
router.get('/meals/today', authMiddleware, getTodaysMeals);
router.get('/progress', authMiddleware, getProgress);
router.post('/ai-analysis', authMiddleware, aiAnalysis);
router.post('/steps', authMiddleware, saveSteps);
router.get('/steps', authMiddleware, getSteps);
router.post('/fcm-token', authMiddleware, updateFcmToken);

export default router;