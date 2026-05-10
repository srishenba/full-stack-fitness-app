import express from "express";
import {
  getProfile,
  aiAnalysis,
  saveSteps,
  getSteps,
  updateFcmToken,
  getDashboard
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Applying middleware globally for all routes in this file.
 * Idhunaala ovvoru route-layum thaniya 'authMiddleware' podanumna avasiyam illai.
 */
router.use(authMiddleware);

// Profile & Dashboard
router.get('/profile', getProfile);
router.get('/dashboard', getDashboard);

// AI & Analytics
router.post('/ai-analysis', aiAnalysis);

// Steps Tracking (GET & POST on the same resource)
router.route('/steps')
  .get(getSteps)
  .post(saveSteps);

// Cloud Messaging
router.post('/fcm-token', updateFcmToken);

export default router;