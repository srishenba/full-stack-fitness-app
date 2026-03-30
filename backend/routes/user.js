const express = require('express');
const router = express.Router();
const { getProfile, aiAnalysis } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, getProfile);
router.post('/ai-analysis', authMiddleware, aiAnalysis);

module.exports = router;
