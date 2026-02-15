import express from "express";
import { addSensorData } from "../controllers/sensor.controller.js";

const router = express.Router();

router.post("/add", addSensorData);

export default router;