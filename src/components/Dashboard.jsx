import React, { useEffect, useState, useMemo } from "react";
import { samplesAPI } from "./APIs";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";
import "./Css/Dashboard.css";

const Dashboard = () => {
  // State
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ category: "", frequency: "" });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const response = await samplesAPI.fetch();
      setSamples(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch samples", err);
      setError("Could not load transaction data.");
      setLoading(false);
    }
  };

  // --- 1. EXTRACT UNIQUE CATEGORIES ---
  // This automatically finds "Procurement", "Food", "Travel" etc. from your data
  const uniqueCategories = useMemo(() => {
    const categories = new Set(samples.map(s => s.Category));
    // Return sorted categories with "All" at the start
    return ["All", ...Array.from(categories).sort()];
  }, [samples]);

  // --- DATA PROCESSING FOR CHARTS ---
  const chartData = useMemo(() => {
    if (!samples.length) return { timeline: [], risk: [], categories: [] };

    // Timeline Data
    const sortedSamples = [...samples].sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const timeline = sortedSamples.map(s => ({
      time: new Date(s.Timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      amount: s.TransactionAmount,
      anomaly: s.AnomalyScore
    }));

    // Risk Distribution
    const suspiciousCount = samples.filter(s => s.SuspiciousFlag === 1).length;
    const safeCount = samples.length - suspiciousCount;
    const risk = [
      { name: "Safe", value: safeCount, color: "#10b981" },
      { name: "Suspicious", value: suspiciousCount, color: "#ef4444" }
    ];

    return { timeline, risk };
  }, [samples]);

  // --- FILTER LOGIC ---
  const filteredSamples = samples.filter((sample) => {
    // Exact match for dropdown (unless "All" is selected which sets category to "")
    const matchCategory = filters.category === "" || sample.Category === filters.category;
    
    // Partial match for frequency
    const matchFreq = filters.frequency === "" || sample.Transaction_Frequency.toString().includes(filters.frequency);
    
    return matchCategory && matchFreq;
  });

  // --- ANALYSIS HANDLER ---
  const handleAnalyze = async (sample) => {
    setShowModal(true);
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const response = await samplesAPI.analyze(sample);
      setAnalysisResult(response.data);
    } catch (err) {
      setAnalysisResult({ error: "Analysis failed." });
    } finally {
      setAnalyzing(false);
    }
  };

  const formatValue = (key, value) => {
      if (typeof value === 'boolean') return value ? "TRUE" : "FALSE";
      if (key.includes("Timestamp") || key.includes("Login")) {
        return new Date(value).toLocaleString();
      }
      return value;
  };

  if (loading) return <div className="dashboard-container">Initializing System...</div>;
  if (error) return <div className="dashboard-container">{error}</div>;

  return (
    <div className="dashboard-container">
      
      {/* STATS OVERVIEW */}
      <div className="stats-grid">
        <div className="stat-card" style={{'--accent': '#3b82f6'}}>
          <div className="stat-value">{samples.length}</div>
          <div className="stat-label">Total Transactions</div>
        </div>
        <div className="stat-card" style={{'--accent': '#10b981'}}>
          <div className="stat-value">
            ₹{samples.reduce((acc, curr) => acc + curr.TransactionAmount, 0).toLocaleString()}
          </div>
          <div className="stat-label">Total Volume</div>
        </div>
        <div className="stat-card" style={{'--accent': '#ef4444'}}>
          <div className="stat-value" style={{color: '#ef4444'}}>
            {samples.filter(s => s.SuspiciousFlag === 1).length}
          </div>
          <div className="stat-label">Active Threats</div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="charts-container">
        <div className="chart-box">
          <div className="chart-title">TRANSACTION FLOW MONITORING</div>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={chartData.timeline}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" stroke="#6b7280" tick={{fontSize: 12}} />
              <YAxis stroke="#6b7280" tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc'}}
                itemStyle={{color: '#93c5fd'}}
              />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <div className="chart-title">SYSTEM THREAT LEVEL</div>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={chartData.risk}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.risk.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                ))}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: '#1e293b', borderRadius: '8px'}} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Category</label>
          {/* UPDATED: Select Dropdown */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value === "All" ? "" : e.target.value })}
          >
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Filter by Frequency</label>
          <input
            type="number"
            placeholder="Min frequency..."
            value={filters.frequency}
            onChange={(e) => setFilters({ ...filters, frequency: e.target.value })}
          />
        </div>
      </div>

      {/* TRANSACTIONS GRID */}
      <div className="transactions-grid">
        {filteredSamples.map((sample, index) => (
          <div key={index} className="transaction-card">
            <div className="card-header">
              <span className="category-badge">{sample.Category}</span>
              <span className="amount">${sample.TransactionAmount.toLocaleString()}</span>
            </div>
            <div className="card-details">
              <p>Freq: <span>{sample.Transaction_Frequency}</span></p>
              <p>Date: <span>{new Date(sample.Timestamp).toLocaleDateString()}</span></p>
              <p>Anomaly: <span>{sample.AnomalyScore}</span></p>
              <p>Suspicious: <span style={{color: sample.SuspiciousFlag ? '#ef4444' : '#10b981'}}>
                {sample.SuspiciousFlag === 1 ? "DETECTED" : "None"}
              </span></p>
            </div>
            <button className="analyze-btn" onClick={() => handleAnalyze(sample)}>
              RUN AI ANALYSIS
            </button>
          </div>
        ))}
      </div>

      {/* ANALYSIS POPUP (Existing Modal Code) */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            <h2>AI Security Analysis</h2>
            {analyzing ? (
               <div style={{ textAlign: "center", padding: "50px" }}>
                 <p style={{ fontSize: "1.2rem", color: "var(--accent)" }}>Processing Transaction Data...</p>
               </div>
            ) : analysisResult ? (
              <div className="analysis-layout">
                <div className="ai-dashboard-layout">
                  <div className={`status-banner ${analysisResult.result.is_fraud ? 'status-danger' : 'status-safe'}`}>
                    <h1 className="status-title">{analysisResult.result.is_fraud ? "FRAUD DETECTED" : "LEGITIMATE"}</h1>
                    <div className="status-subtitle">
                      AI CONFIDENCE: {((1 - Math.abs(0.5 - analysisResult.result.risk_score) * 2) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="risk-section">
                    <div className="meter-label">
                      <span>RISK ASSESSMENT SCORE</span>
                      <span>{(analysisResult.result.risk_score * 100).toFixed(2)} / 100</span>
                    </div>
                    <div className="progress-track">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${analysisResult.result.risk_score * 100}%`,
                          backgroundColor: analysisResult.result.risk_score > 0.5 ? '#ef4444' : '#10b981'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="data-grid-title">ANALYZED PARAMETERS</div>
                    <div className="tech-grid">
                      {Object.entries(analysisResult.input).map(([key, value]) => (
                        <div key={key} className="tech-item">
                          <span className="tech-label">{key.replace(/_/g, " ")}</span>
                          <span className="tech-value">{formatValue(key, value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="chart-section">
                   <h3 style={{marginBottom: '20px', textAlign: 'center'}}>Comparative Metrics</h3>
                   <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Anomaly Score", value: analysisResult.input.AnomalyScore, color: "#f59e0b" },
                        { name: "Risk Score", value: analysisResult.result.risk_score, color: analysisResult.result.risk_score > 0.5 ? "#ef4444" : "#10b981" }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis domain={[0, 1]} stroke="#9ca3af" />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                        <Cell fill="#f59e0b" />
                        <Cell fill={analysisResult.result.risk_score > 0.5 ? "#ef4444" : "#10b981"} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : <p>No result available.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;