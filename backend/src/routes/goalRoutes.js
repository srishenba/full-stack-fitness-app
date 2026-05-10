import express from 'express';
import { getTodayGoals, updateGoal } from '../controllers/goalController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/today', authMiddleware, getTodayGoals);
router.post('/update', authMiddleware, updateGoal);

export default router;
