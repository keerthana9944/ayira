import express from "express";
import { chatWithAyira, explainReport, getChatHistory } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.post("/chat", chatWithAyira);
router.get("/history", getChatHistory);
router.get("/explain", explainReport);

export default router;