import express from "express";
import { createDailyReport, getAllReports } from "../controllers/report.controller.js";

const router = express.Router();

router.post("/daily", createDailyReport);
router.get("/all", getAllReports);

export default router;