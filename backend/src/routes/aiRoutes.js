import express from "express";
import { chatWithAI, generateFitnessAnalysis, getAnalysisHistory, detectNutrition } from "../controllers/aiController.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/ai/chat
 * @desc    Chat with openai AI
 * @access  Public
 */
router.post("/chat", chatWithAI);

/**
 * @route   POST /api/ai/generate-analysis
 * @desc    Generate personalized health analysis
 * @access  Private
 */
router.post("/generate-analysis", authMiddleware, generateFitnessAnalysis);

/**
 * @route   GET /api/ai/history
 * @desc    Get AI analysis history
 * @access  Private
 */
router.get("/history", authMiddleware, getAnalysisHistory);

/**
 * @route   POST /api/ai/detect-nutrition
 * @desc    Detect nutrition values from food name
 * @access  Private
 */
router.post("/detect-nutrition", authMiddleware, detectNutrition);

export default router;
