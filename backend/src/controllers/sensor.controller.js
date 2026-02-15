import db from "../database/db.js";

export function addSensorData(req, res){
    const{
        glucose,
        lactate,
        sodium,
        potassium,
        chloride,
        cortisol,
        skin_temperature,
        stress_level,
        heart_rate,
        sweat_rate,
        estradiol,
        progesterone,
        lh,
        fsh,
        testosterone,
        shbg,
        crp
    } = req.body;

    db.run(
        `INSERT INTO sensor_data(
          glucose, lactate, sodium, potassium, chloride, cortisol, skin_temperature,
          stress_level, heart_rate, sweat_rate, estradiol, progesterone, lh, fsh,
          testosterone, shbg, crp
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        
        [
            glucose, lactate, sodium, potassium, chloride, cortisol,
            skin_temperature, stress_level, heart_rate, sweat_rate, 
            estradiol, progesterone, lh, fsh, testosterone, shbg, crp
        ],

        function (err){
            if(err){
                console.error("SENSOR INSERT ERROR:", err);
                return res.status(500).json({ error: "Failed to save sensor data" });
            }

            res.json({
                message: "Sensor data saved successfully",
                id: this.lastID
            });
        }
    );
}