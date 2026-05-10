import express from 'express';
import { saveSteps, getStepsByUser, getTodaySteps } from '../controllers/stepController.js';

const router = express.Router();

router.post('/', saveSteps);
router.get('/:userId', getStepsByUser);
router.get('/:userId/today', getTodaySteps);

export default router;
