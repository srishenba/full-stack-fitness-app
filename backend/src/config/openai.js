import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;



// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";

// dotenv.config();

// // ✅ Pass your API key properly
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // ✅ Define model correctly
// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash"
// });

// export default model;