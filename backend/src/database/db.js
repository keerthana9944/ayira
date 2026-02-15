import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// required for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// path to database
const dbPath = path.join("/tmp", "ayira.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if(err){
        console.error("Failed to connect to AYIRA database", err);
    }else{
        console.log("Connected to AYIRA local database");
    }
});

export default db;