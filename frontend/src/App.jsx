import { useState } from "react";
import axios from "axios";
import "./App.css";
import Plot from "react-plotly.js";

export default function App() {

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  const [form, setForm] = useState({
    glucose: "", 
    lactate: "", 
    sodium: "", 
    potassium: "", 
    chloride: "",
    cortisol: "", 
    skin_temperature: "", 
    stress_level: "", 
    heart_rate: "",
    sweat_rate: "", 
    estradiol: "", 
    progesterone: "", 
    lh: "", 
    fsh: "",
    testosterone: "", 
    shbg: "", 
    crp: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SUBMIT SENSOR DATA
  const submitSensor = async () => {
    try {
      await axios.post("https://ayira-backend.onrender.com/api/sensor/add",
        Object.fromEntries(
          Object.entries(form).map(([k, v]) => [k, Number(v)])
        )
      );

      setMessage("Sensor data submitted successfully");
      setIsError(false);

    } catch {
      setMessage("Failed to submit sensor data");
      setIsError(true);
    }
  };

  // ✅ GENERATE REPORT
  const generateReport = async () => {
    setLoading(true);
    try {

      const res = await axios.post("https://ayira-backend.onrender.com/api/reports/daily");

      setMessage(res.data.summary);
      setIsError(false);

      const all = await axios.get("https://ayira-backend.onrender.com/api/reports/all");
      setReports(all.data);

    } catch {
      setMessage("Failed to generate report");
      setIsError(true);
    }
    setLoading(false);
  };

  // ✅ CHART DATA
  const chartData = reports.map(r => {
    const match = r.summary.match(/PCOS\s*Risk\s*Score\s*[:\-]?\s*(\d+)/i);

    return {
      time: new Date(r.generated_at).toLocaleString(),
      risk: match ? Number(match[1]) : 0
    };
  });

  // ✅ RISK LEVEL FUNCTION
  const getRiskLevel = (score) => {
    if (score <= 30) return { label: "LOW RISK", color: "green" };
    if (score <= 60) return { label: "MODERATE RISK", color: "orange" };
    return { label: "HIGH RISK", color: "red" };
  };

  // ✅ LATEST REPORT
  const latestReport = [...reports].sort(
    (a, b) => new Date(b.generated_at) - new Date(a.generated_at)
  )[0];

  const latestSummary = latestReport ? latestReport.summary : "";

  const latestScoreMatch =
    latestSummary.match(/PCOS\s*Risk\s*Score\s*[:\-]?\s*(\d+)/i);

  const latestScore = latestScoreMatch
    ? Number(latestScoreMatch[1])
    : null;

  const latestRisk =
    latestScore !== null ? getRiskLevel(latestScore) : null;

  // ✅ INSIGHTS
  const getInsights = (summary) => {
    if (!summary) return [];

    const insights = [];

    if (summary.includes("LH Surge"))
      insights.push("LH surge detected");

    if (summary.includes("Low Progesterone"))
      insights.push("Low progesterone - possible anovulation");

    if (summary.includes("High Cortisol"))
      insights.push("High cortisol - elevated stress");

    if (summary.includes("High CRP"))
      insights.push("Elevated CRP - inflammation");

    if (summary.includes("High Testosterone"))
      insights.push("Elevated testosterone - PCOS indicator");

    return insights;
  };

  const insights = getInsights(latestSummary);

  return (
    <div className="app">
      <div className="container">

        <div className="contentWrapper"></div>

        <div className="titleBlock">
           <h1>AYIRA</h1>
           <p>AI for Your Integrated Reproductive Awareness</p>
        </div>

        <h2 className="sectionTitle">Manual Health Data Input</h2>

        {/* ✅ INPUT GRID */}
        <div className="inputGrid">
          {Object.keys(form).map((key) => (
            <div className="inputBox" key={key}>
              <label>
                {key
                  .replaceAll("_", " ")
                  .replace(/\b\w/g, c => c.toUpperCase())
                }
              </label>

              <input
                name={key}
                value={form[key]}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}
        </div>

        {/* ✅ BUTTON ROW */}
        <div className="buttonRow">
          <button onClick={submitSensor} className="secondaryBtn">
            Submit Sensor Data
          </button>

          <button
            onClick={generateReport}
            disabled={loading}
            className="primaryBtn"
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>

        {/* ✅ MESSAGE */}
        {message && (
          <div className={isError ? "errorBox" : "successBox"}>
            {message}
          </div>
        )}

        {/* ✅ PCOS STATUS */}
        {latestRisk && (
          <div className="reportCard"
            style={{ borderLeft: `6px solid ${latestRisk.color}` }}
          >
            <strong>Current PCOS Status:</strong>{" "}
            <span style={{ color: latestRisk.color }}>
              {latestRisk.label} ({latestScore}%)
            </span>
          </div>
        )}

        {/* ✅ INSIGHTS */}
        {insights.length > 0 && (
          <div className="reportCard">
            <h3>Health Insights</h3>
            {insights.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        )}

        {/* ✅ REPORT HISTORY */}
        {reports.map((r) => (
          <div key={r.id} className="reportCard">
            <small>{new Date(r.generated_at).toLocaleString()}</small>
            <p>{r.summary}</p>
          </div>
        ))}

        {/* ✅ CHART */}
        {chartData.length > 0 && (
          <Plot
            data={[
              {
                x: chartData.map(d => d.time),
                y: chartData.map(d => d.risk),
                type: "scatter",
                mode: "lines+markers",
                name: "PCOS Risk Score"
              }
            ]}
            layout={{
              title: "PCOS Risk Trend",
              xaxis: { title: "Time" },
              yaxis: { title: "Risk Score", range: [0, 100] }
            }}
            style={{ width: "100%", height: "400px", marginTop: 40 }}
          />
        )}

      </div>
    </div>
  );
}
