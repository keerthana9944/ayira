import express from "express";
import { explainLatestReport } from "../controllers/report.chatbot.controller.js";

const router = express.Router();

router.get("/explain", explainLatestReport);

export default router;