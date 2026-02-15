import { getLatestReport } from "../services/report.fetch.service.js";
import { askAyira } from "../services/ollama.service.js";

export function explainLatestReport(req,res){
    getLatestReport(async(err,report) => {
        if(err || !report){
            return res.status(400).json({ error: "No report found"});
        }

        const prompt = `
        You are AYIRA, a reproductive health awareness assistant.
        Here is today's health report:
        "${report.summary}"
        Explain this report in simple, calm language.
        Do NOT diagnose.
        Do NOT give medical treatment.
        Focus only on awareness and reassurance.
        `;

        try{
            const explanation = await askAyira(prompt);
            res.json({
                report_data: report.generated_at,
                explanation
            });
        } catch(e){
            res.status(500).json({ error: "Failed to explain report"});
        }
    });
}