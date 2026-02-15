import db from "../database/db.js";

export function generateDailyReport(callback){
    db.get(`
        SELECT * 
        FROM sensor_data
        ORDER BY recorded_at DESC
        LIMIT 1
    `,

      (err, row) => {
        if(err) return callback(err);
        if(!row) return callback("No sensor data found");

        const avgTemp = row.skin_temperature;
        const avgHR = row.heart_rate;
        const avgStress = row.stress_level;
        const avgGlucose = row.glucose;
        const avgCortisol = row.cortisol;
        const avgLH = row.lh;
        const avgFSH = row.fsh;
        const avgTestosterone = row.testosterone;
        const avgCRP = row.crp;
        const avgProgesterone = row.progesterone;
        const avgSHBG = row.shbg;

        //Derived medical indicators
        const lhFshRatio = avgLH > 0 ? avgLH/avgFSH : 0;
        const androgenStatus = avgTestosterone > 70 ? "elevated" : "normal";
        const inflammation =  avgCRP > 3 ? "elevated" : "normal";
        
        // PCOS risk engine
        let risk = 0;

        if(lhFshRatio > 2) risk += 20;
        if(avgTestosterone > 70) risk += 20;
        if(avgGlucose > 120) risk += 15;
        if(avgCRP > 3) risk += 15;
        if(avgCortisol > 20) risk+=10;
        if(avgStress > 60) risk+=10;
        if(avgProgesterone < 5) risk+=10;
        if(avgSHBG < 30) risk+=10;

        if(risk > 100) risk=100;

        const riskLevel = 
           risk > 60 ? "High" : 
           risk > 30 ? "Moderate" : 
           "Low";

        const summary = `
        Body temperature: ${avgTemp ? avgTemp.toFixed(2) + "°C" : "not available"}.
        Heart rate: ${avgHR ? avgHR.toFixed(0) + "bpm" : "not available"}.
        Stress level: ${avgStress > 60 ? "Elevated" : "Normal"}.

        Glucose level: ${avgGlucose ? avgGlucose.toFixed(1) + "mg/dL" : "not available"}.
        Cortisol: ${avgCortisol ? avgCortisol.toFixed(1) : "not available"}.

        LH/FSH ratio: ${lhFshRatio.toFixed(2)}.
        Androgen status: ${androgenStatus}.
        Inflammation (CRP): ${inflammation}.

        PCOS Risk Score: ${risk}/100.
        Risk Level: ${riskLevel}.
        `;

        db.run(`
            INSERT INTO reports (
              avg_temperature, 
              avg_heart_rate, 
              avg_stress_level,
              avg_glucose,
              avg_cortisol,
              avg_lh,
              avg_fsh,
              avg_testosterone,
              avg_crp,
              lh_fsh_ratio,
              pcos_risk,
              risk_level,
              androgen_status,
              inflammation,
              summary
            )
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            
            [
                avgTemp,
                avgHR,
                avgStress,
                avgGlucose,
                avgCortisol,
                avgLH,
                avgFSH,
                avgTestosterone,
                avgCRP,
                lhFshRatio,
                risk,
                riskLevel,
                androgenStatus,
                inflammation,
                summary
            ],
            function(err){
                if(err) return callback(err);
                callback(null, { id: this.lastID, summary});
            }
        );
      }
    );
}