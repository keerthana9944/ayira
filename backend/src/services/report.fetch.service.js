import db from "../database/db.js";

export function getLatestReport(callback){
    db.get(
        `SELECT summary, generated_at
        FROM reports
        ORDER BY generated_at DESC
        LIMIT 1
        `,
        (err, row) => {
            if(err) return callback(err);
            callback(null, row);
        }
    );
}