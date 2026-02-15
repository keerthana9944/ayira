import { askAyira } from "../services/ollama.service.js";
import db from "../database/db.js";


// Free chat with AYIRA
export async function chatWithAyira(req, res) {
    try{
        const { message } = req.body;

        if(!message){
            return res.status(400).json({ error: "Message is required"});
        }

        const reply = await askAyira(message);

        db.run(
            `INSERT INTO chat_logs (user_message, bot_reply) VALUES (?, ?)`,
            [message, reply]
        )
        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AYIRA chatbot failed" });
    }
}

// Chat History
export function getChatHistory(req,res){
    const limit = Number(req.query.limit) || 10;

    const query = `
    SELECT user_message, bot_reply, created_at
    FROM chat_logs
    ORDER BY created_at DESC
    LIMIT ${limit}
    `;

    db.all(query, (err, rows) => {
        if(err){
            console.error("DB ERROR:", err);
            return res.status(500).json({ error: "Failed to fetch chat history"});
        }

        res.json({
            count: rows.length,
            history: rows
        });
    });
}

// Explanation of Latest Medical Report

export function explainReport(req,res){
    db.get(
        `SELECT * FROM reports ORDER BY id DESC LIMIT 1`,

        (err, row) => {
            if(err){
                console.error(err);
                return res.status(500).json({ error: "Failed to fetch report" });
            }

            if(!row){
                return res.json({ message: "No report available yet" });
            }

            res.json({
                report_date: row.generated_at,
                explanation: row.summary
            });
        }
    );
}