import { generateDailyReport } from "../services/report.service.js";
import db from "../database/db.js";

export function createDailyReport(req, res){
    generateDailyReport((err, data) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: "Failed to generate report" });
        }

        res.json({
            message: "Daily report generated",
            report_id: data.id,
            summary: data.summary
        });
    });
}

export function getAllReports(req,res){
    db.all(
        "SELECT * FROM reports ORDER BY generated_at DESC",
        [],
        (err, rows) => {
            if(err){
                console.error(err);
                return res.status(500).json({ error: "Failed to fetch reports" });
            }
            res.json(rows);
        }
    );
}