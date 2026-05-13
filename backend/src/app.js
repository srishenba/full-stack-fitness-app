import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "../routes/auth.js";
import userRoutes from "../routes/user.js";
import stepRoutes from "../routes/stepRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

// Load env
dotenv.config();

// Connect DB
connectDB();

// ✅ FIRST create app
const app = express();

// ✅ THEN middleware
app.use(cors());
app.use(express.json());

// ✅ THEN routes
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/steps", stepRoutes);
app.use("/api/goals", goalRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});
app.get("/test-dashboard", (req, res) => {
  res.send("Dashboard route working");
});
// ✅ SERVE FRONTEND (Single Port Deployment)
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

// ✅ CATCH-ALL ROUTE (Ensure routing works & no blank dashboard issue)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;