import express from 'express';
import cors from "cors";
import "./database/init.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import sensorRoutes from "./routes/sensor.routes.js";
import reportRoutes from "./routes/report.routes.js";
import reportChatbotRoutes from "./routes/report.chatbot.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// chatbot routes
app.use("/api/chatbot", chatbotRoutes);

// sensor route
app.use("/api/sensor", sensorRoutes);

// report route
app.use("/api/reports", reportRoutes);

// reportChatbot route
app.use("/api/reports/chatbot", reportChatbotRoutes);

//health check
app.get("/health", (req,res) => {
    res.json({status : "AYIRA backend running"});
});

app.listen(PORT, () => {
    console.log(`AYIRA backend running on ${PORT}`);
});