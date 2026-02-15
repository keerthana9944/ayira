import db from "./db.js";

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS chat_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_message TEXT NOT NULL,
        bot_reply TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("Chat logs table ready");


    db.run(`
        CREATE TABLE IF NOT EXISTS sensor_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        
        --Sweat / physiological metrices (current sensors)
        glucose REAL,
        lactate REAL,
        sodium REAL,
        potassium REAL,
        chloride REAL,
        cortisol REAL,
        skin_temperature REAL,
        stress_level INTEGER,
        heart_rate INTEGER,
        sweat_rate REAL,

        --Harmonal . inflammatory markers (manual now, sensor later)
        estradiol REAL,
        progesterone REAL,
        lh REAL,
        fsh REAL,
        testosterone REAL,
        shbg REAL,
        crp REAL,

        recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("Sensor data table ready");


    db.run(`
        CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        avg_temperature REAL,
        avg_heart_rate REAL,
        avg_stress_level REAL,
        avg_glucose REAL,
        avg_cortisol REAL,
        avg_lh REAL,
        avg_fsh REAL,
        avg_testosterone REAL,
        avg_crp REAL,

        lh_fsh_ratio REAL,
        pcos_risk INTEGER,
        risk_level TEXT,
        androgen_status TEXT,
        inflammation TEXT,
        
        summary TEXT,
        generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    );
    console.log("Reports table ready");
})