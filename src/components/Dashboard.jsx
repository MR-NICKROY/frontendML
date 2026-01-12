import React, { useEffect, useState, useMemo } from "react";
import { samplesAPI } from "./APIs"; 
import { motion } from "framer-motion";
import {
  AreaChart, Area, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, BarChart, Bar
} from "recharts";
import { FiX, FiCpu, FiCheckCircle, FiAlertTriangle, FiSearch, FiDatabase, FiActivity } from "react-icons/fi";
import Transactions from "./Transactions";
import "./Css/Dashboard.css";

// THEME for particles
const themeColor = '#5865F2'; 
const borderColor = '#1E293B';

const Dashboard = () => {
  // --- STATE ---
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ category: "", frequency: "" });

  const [showModal, setShowModal] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null); // To show Payload

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await samplesAPI.fetch();
        const validData = Array.isArray(response.data) ? response.data : [];
        setSamples(validData);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to connect to backend.");
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const uniqueCategories = useMemo(() => {
    if (!samples.length) return ["All"];
    const categories = new Set(samples.map(s => s.Category));
    return ["All", ...Array.from(categories).sort()];
  }, [samples]);

  const chartData = useMemo(() => {
    if (!samples.length) return { timeline: [], risk: [] };
    const sortedSamples = [...samples].sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    const timeline = sortedSamples.map(s => ({
      time: new Date(s.Timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      amount: s.TransactionAmount,
    }));
    const suspiciousCount = samples.filter(s => s.SuspiciousFlag === 1).length;
    const risk = [
      { name: "Safe", value: samples.length - suspiciousCount, color: "#10b981" },
      { name: "Suspicious", value: suspiciousCount, color: "#ef4444" }
    ];
    return { timeline, risk };
  }, [samples]);

  const filteredSamples = samples.filter((sample) => {
    const matchCategory = filters.category === "" || sample.Category === filters.category;
    const freq = sample.Transaction_Frequency ? sample.Transaction_Frequency.toString() : "";
    const matchFreq = filters.frequency === "" || freq.includes(filters.frequency);
    return matchCategory && matchFreq;
  });

  const handleAnalyze = async (sample) => {
    setSelectedSample(sample); // Store payload
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
      if (typeof value === 'boolean') return value ? "DETECTED" : "None";
      if (key.includes("Timestamp") || key.includes("Login")) return new Date(value).toLocaleString();
      return value;
  };

  // --- HELPER FOR GRAPHS (ONLY 2 NOW) ---
  const getGraphData = (result) => {
      if (!result) return { levelData: [], scoreData: [] };
      
      // 1. Risk Score Graph Data (Pie/Gauge)
      const scoreData = [
          { name: "Risk", value: result.riskScore * 100, color: result.riskScore > 0.5 ? '#ef4444' : '#10b981' },
          { name: "Safe", value: 100 - (result.riskScore * 100), color: '#1e293b' }
      ];

      // 2. Risk Level Graph Data (Bar)
      const levels = ["LOW", "MEDIUM", "HIGH"];
      const levelColors = { LOW: "#10b981", MEDIUM: "#f59e0b", HIGH: "#ef4444" };
      const levelData = levels.map(l => ({
          name: l,
          value: result.riskLevel === l ? 100 : 20,
          color: result.riskLevel === l ? levelColors[l] : '#334155'
      }));

      return { levelData, scoreData };
  };

  if (loading) return <div className="dashboard-container" style={{textAlign:'center', padding:'50px', color: '#94a3b8'}}>Initializing CyberGuard Neural Link...</div>;
  if (error) return <div className="dashboard-container" style={{textAlign:'center', color:'#ef4444', padding:'50px'}}>{error}</div>;

  const graphs = analysisResult && !analysisResult.error ? getGraphData(analysisResult) : null;

  return (
    <div className="dashboard-container" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* BACKGROUND */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0,
          backgroundImage: `linear-gradient(${borderColor} 1px, transparent 1px), linear-gradient(90deg, ${borderColor} 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        {[...Array(500)].map((_, i) => (
          <motion.div key={i}
            style={{
              position: 'absolute', width: 3, height: 3, borderRadius: '50%', background: themeColor,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [-20, -40, -20], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="stats-grid">
          <div className="stat-card" style={{'--accent': '#3b82f6'}}>
            <div className="stat-value">{samples.length}</div>
            <div className="stat-label">Total Transactions</div>
          </div>
          <div className="stat-card" style={{'--accent': '#10b981'}}>
            <div className="stat-value">₹{samples.reduce((acc, curr) => acc + (curr.TransactionAmount || 0), 0).toLocaleString()}</div>
            <div className="stat-label">Total Volume</div>
          </div>
          <div className="stat-card" style={{'--accent': '#ef4444'}}>
            <div className="stat-value" style={{color: '#ef4444'}}>{samples.filter(s => s.SuspiciousFlag === 1).length}</div>
            <div className="stat-label">Active Threats</div>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-box">
            <div className="chart-title">TRANSACTION FLOW</div>
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
                <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155'}} />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <div className="chart-title">THREAT LEVEL</div>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={chartData.risk} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.risk.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#1e293b', borderRadius: '8px'}} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>Category</label>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value === "All" ? "" : e.target.value })}>
              {uniqueCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Frequency</label>
            <input type="number" placeholder="Min frequency..." value={filters.frequency} onChange={(e) => setFilters({ ...filters, frequency: e.target.value })} />
          </div>
        </div>

        <div className="transactions-grid">
          {filteredSamples.length > 0 ? (
            filteredSamples.map((sample, index) => (
              <div key={sample._id || index} className="transaction-card">
                <div className="card-header">
                  <span className="category-badge">{sample.Category}</span>
                  <span className="amount">₹{sample.TransactionAmount?.toLocaleString()}</span>
                </div>
                <div className="card-details">
                  <p>Freq: <span>{sample.Transaction_Frequency}</span></p>
                  <p>Date: <span>{sample.Timestamp ? new Date(sample.Timestamp).toLocaleDateString() : 'N/A'}</span></p>
                  <p>Suspicious: <span style={{color: sample.SuspiciousFlag ? '#ef4444' : '#10b981'}}>{sample.SuspiciousFlag === 1 ? "DETECTED" : "None"}</span></p>
                </div>
                <button className="analyze-btn" onClick={() => handleAnalyze(sample)}>RUN AI ANALYSIS</button>
              </div>
            ))
          ) : (
            <div style={{color: '#94a3b8', gridColumn: '1 / -1', textAlign: 'center', padding: '20px'}}>No transactions found.</div>
          )}
        </div>

        <Transactions/>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}><FiX /></button>
            <div className="modal-header">
              <FiCpu className="modal-icon spin-slow" />
              <div><h2>AI Forensics Report</h2><p>Real-time anomaly detection inference</p></div>
            </div>
            {analyzing ? (
               <div className="loading-state"><div className="loader-ring"></div><p>Processing Neural Vectors...</p></div>
            ) : analysisResult ? (
              analysisResult.error ? (
                <div style={{color: '#ef4444', textAlign: 'center', padding: '20px'}}>{analysisResult.error}</div>
              ) : (
                <div className="modal-body">
                  {/* --- LEFT: 2 GRAPHS SECTION --- */}
                  <div className="score-card-container">
                    
                    {/* Graph 1: Risk Score */}
                    <div className="mini-chart-wrapper">
                        <div className="chart-label">RISK SCORE ({(analysisResult.riskScore * 100).toFixed(0)}%)</div>
                        <div style={{width: '100%', height: '140px', margin: '10px 0'}}>
                             <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={graphs.scoreData} startAngle={180} endAngle={0} innerRadius={60} outerRadius={80} dataKey="value" cy="70%">
                                        {graphs.scoreData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{textAlign: 'center', marginTop: '-40px', fontWeight: 'bold', fontSize: '1.2rem', color: graphs.scoreData[0].color}}>
                                {analysisResult.decision}
                            </div>
                        </div>
                    </div>

                    {/* Graph 2: Risk Level */}
                    <div className="mini-chart-wrapper">
                        <div className="chart-label">RISK LEVEL</div>
                        <div style={{width: '100%', height: '120px'}}>
                            <ResponsiveContainer>
                                <BarChart data={graphs.levelData}>
                                    <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 10}} interval={0} axisLine={false} tickLine={false}/>
                                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1e293b', border: 'none'}}/>
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {graphs.levelData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                  </div>

                  {/* --- RIGHT: PAYLOAD & DETAILS SECTION --- */}
                  <div className="details-container">
                    
                    {/* SECTION 1: PAYLOAD (INPUT) */}
                    <h3><FiDatabase /> Input Payload</h3>
                    <div className="cyber-grid" style={{marginBottom: '20px', maxHeight: '150px'}}>
                        <div className="cyber-item"><span className="cyber-label">Amount</span><span className="cyber-value">₹{selectedSample?.TransactionAmount}</span></div>
                        <div className="cyber-item"><span className="cyber-label">Category</span><span className="cyber-value">{selectedSample?.Category}</span></div>
                        <div className="cyber-item"><span className="cyber-label">Time</span><span className="cyber-value">{new Date(selectedSample?.Timestamp).toLocaleTimeString()}</span></div>
                        <div className="cyber-item"><span className="cyber-label">Suspicious Flag</span><span className="cyber-value">{selectedSample?.SuspiciousFlag ? "1" : "0"}</span></div>
                    </div>

                    {/* SECTION 2: RESULTS */}
                    <h3><FiActivity /> Detection Logic</h3>
                    <div className="cyber-grid">
                      {/* Show the boolean flags */}
                      {analysisResult.details && Object.entries(analysisResult.details).map(([key, value]) => (
                         <div key={key} className="cyber-item">
                             <span className="cyber-label">{key.replace(/_/g, " ")}</span>
                             <span className="cyber-value" style={{color: value ? (key.includes('low') ? '#10b981' : '#ef4444') : '#94a3b8'}}>
                                 {formatValue(key, value)}
                             </span>
                         </div>
                      ))}
                      
                      {/* Basic info */}
                      <div className="cyber-item"><span className="cyber-label">Confidence</span><span className="cyber-value">{(80 + (Math.abs(analysisResult.riskScore - 0.5) * 38)).toFixed(2)}%</span></div>
                    </div>
                  </div>
                </div>
              )
            ) : <p>No data.</p>}
          </div>
        </div>
      )}

      <style>{`
        /* MODAL CSS */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease; }
        .modal-glass-panel { width: 90%; max-width: 850px; background: rgba(17, 24, 39, 0.95); border: 1px solid #374151; box-shadow: 0 0 40px rgba(88, 101, 242, 0.2), inset 0 0 0 1px rgba(255,255,255,0.05); border-radius: 20px; padding: 0; position: relative; overflow: hidden; animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .modal-header { padding: 24px 30px; background: linear-gradient(90deg, rgba(88,101,242,0.1) 0%, transparent 100%); border-bottom: 1px solid #1f2937; display: flex; align-items: center; gap: 16px; }
        .modal-header h2 { margin: 0; font-size: 1.4rem; color: #fff; letter-spacing: 0.5px; }
        .modal-header p { margin: 4px 0 0 0; color: #94a3b8; font-size: 0.9rem; }
        .modal-icon { font-size: 2rem; color: #5865f2; }
        .spin-slow { animation: spin 4s linear infinite; }
        .close-btn { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.05); border: none; color: #94a3b8; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; z-index: 10; }
        .close-btn:hover { background: #ef4444; color: white; transform: rotate(90deg); }
        
        .modal-body { display: grid; grid-template-columns: 350px 1fr; min-height: 450px; }
        
        .score-card-container { background: #0b1120; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; border-right: 1px solid #1f2937; }
        .mini-chart-wrapper { width: 100%; text-align: center; margin-bottom: 10px; position: relative; }
        .chart-label { font-size: 0.75rem; color: #94a3b8; letter-spacing: 1px; margin-bottom: 5px; font-weight: 700; text-transform: uppercase; }
        
        .details-container { padding: 30px; overflow-y: auto; }
        .details-container h3 { margin: 20px 0 10px 0; font-size: 1rem; color: #fff; display: flex; align-items: center; gap: 10px; opacity: 0.9; }
        .details-container h3:first-child { margin-top: 0; }
        
        .cyber-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; overflow-y: auto; padding-right: 5px; }
        .cyber-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; transition: 0.2s; }
        .cyber-item:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
        .cyber-label { display: block; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px; }
        .cyber-value { font-size: 0.95rem; color: #fff; font-weight: 500; word-break: break-word; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .modal-body { grid-template-columns: 1fr; } .score-card-container { border-right: none; border-bottom: 1px solid #1f2937; } }
      `}</style>
    </div>
  );
};

export default Dashboard;
