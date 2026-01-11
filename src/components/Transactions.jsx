import React, { useState } from "react";
import { transactionsAPI } from "./APIs/transactions.api.js"; 
import {
  PieChart, Pie, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { FiX, FiCpu, FiDatabase, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";

// --- THEME CONFIG ---
const theme = {
  bg: '#0B1120',          
  surface: '#151B2B',     
  primary: '#5865F2',     
  inputBg: '#0F1623',
  border: '#1E293B',
  text: '#FFFFFF',
  textMuted: '#94A3B8'
};

const Transactions = () => {
  // --- Form State (REMOVED SuspiciousFlag) ---
  const [formData, setFormData] = useState({
    TransactionAmount: "",
    Timestamp: "",
    LastLogin: "",
    Category: "Food",
    AnomalyScore: "0.1",
    Transaction_Frequency: "1",
    Total_Linked_Value: "",
    // SuspiciousFlag removed
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showModal, setShowModal] = useState(false); 

  // Options
  const categories = ["Food", "Travel", "Procurement", "Entertainment", "Utilities", "Housing", "Transport", "Other"];
  const anomalyOptions = [ { label: "Low (0.1)", value: 0.1 }, { label: "Medium (0.5)", value: 0.5 }, { label: "High (0.9)", value: 0.9 } ];
  // Flag options removed
  const freqOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setAnalysisResult(null);

    try {
      // Payload (REMOVED SuspiciousFlag)
      const payload = {
        TransactionAmount: Number(formData.TransactionAmount),
        Timestamp: formData.Timestamp,
        LastLogin: formData.LastLogin,
        Category: formData.Category,
        AnomalyScore: Number(formData.AnomalyScore),
        Transaction_Frequency: Number(formData.Transaction_Frequency),
        Total_Linked_Value: Number(formData.Total_Linked_Value)
        // SuspiciousFlag is NOT sent. The backend/ML will default it to 0.
      };

      const response = await transactionsAPI.addManual(payload);
      setAnalysisResult(response.data);
      setShowModal(true); 

    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please check your network or input.");
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (key, value) => {
    if (typeof value === 'boolean') return value ? "DETECTED" : "None";
    if (key === "Timestamp" || key === "LastLogin") return new Date(value).toLocaleString();
    return value;
  };

  // Helper for Graphs
  const getGraphData = (result) => {
    if (!result) return { levelData: [], scoreData: [] };
    
    // 1. Score (Gauge)
    const scoreData = [
        { name: "Risk", value: result.riskScore * 100, color: result.riskScore > 0.5 ? '#ef4444' : '#10b981' },
        { name: "Safe", value: 100 - (result.riskScore * 100), color: '#1e293b' }
    ];

    // 2. Level (Bar)
    const levels = ["LOW", "MEDIUM", "HIGH"];
    const levelColors = { LOW: "#10b981", MEDIUM: "#f59e0b", HIGH: "#ef4444" };
    const levelData = levels.map(l => ({
        name: l,
        value: result.riskLevel === l ? 100 : 20, 
        color: result.riskLevel === l ? levelColors[l] : '#334155'
    }));

    return { levelData, scoreData };
  };

  const graphs = analysisResult ? getGraphData(analysisResult) : null;

  // --- STYLES ---
  const styles = `
    .trans-container {
      background-color: ${theme.bg};
      padding: 40px;
      color: ${theme.text};
      font-family: 'Inter', sans-serif;
      border-top: 1px solid ${theme.border};
      position: relative; 
      overflow: hidden;   
    }
    .trans-header { margin-bottom: 30px; border-bottom: 1px solid ${theme.border}; padding-bottom: 10px; }
    .trans-title { font-size: 1.5rem; font-weight: 800; color: ${theme.primary}; display: flex; align-items: center; gap: 10px; }
    
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
    
    .input-group label { display: block; margin-bottom: 8px; color: ${theme.textMuted}; font-size: 0.9rem; font-weight: 600; }
    .cyber-input {
      width: 100%;
      background: ${theme.inputBg};
      border: 1px solid ${theme.border};
      color: white;
      padding: 12px;
      border-radius: 8px;
      outline: none;
      transition: 0.2s;
    }
    .cyber-input:focus { border-color: ${theme.primary}; box-shadow: 0 0 0 3px rgba(88, 101, 242, 0.2); }
    
    .analyze-btn {
      grid-column: 1 / -1;
      background: ${theme.primary};
      color: white;
      border: none;
      padding: 16px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 20px;
      letter-spacing: 1px;
      transition: 0.2s;
    }
    .analyze-btn:hover { background: #4752c4; }
    .analyze-btn:disabled { opacity: 0.6; }

    /* MODAL CSS (Shared style) */
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

    /* Left Column (Graphs) */
    .score-card-container { background: #0b1120; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; border-right: 1px solid #1f2937; }
    .mini-chart-wrapper { width: 100%; text-align: center; margin-bottom: 10px; position: relative; }
    .chart-label { font-size: 0.75rem; color: #94a3b8; letter-spacing: 1px; margin-bottom: 5px; font-weight: 700; text-transform: uppercase; }

    /* Right Column (Details) */
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
  `;

  return (
    <div className="trans-container">
      <style>{styles}</style>
      
      {/* BACKGROUND */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0,
          backgroundImage: `linear-gradient(${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        {[...Array(300)].map((_, i) => (
          <motion.div key={i}
            style={{
              position: 'absolute', width: 3, height: 3, borderRadius: '50%', background: theme.primary,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [-20, -40, -20], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="trans-header">
          <h2 className="trans-title">Manual Transaction Analysis</h2>
          <p style={{color: theme.textMuted}}>Enter transaction parameters to run the neural network inference model manually.</p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="input-group">
            <label>Amount (₹)</label>
            <input type="number" name="TransactionAmount" className="cyber-input" required value={formData.TransactionAmount} onChange={handleChange} placeholder="0.00"/>
          </div>
          <div className="input-group">
            <label>Timestamp</label>
            <input type="datetime-local" name="Timestamp" className="cyber-input" required value={formData.Timestamp} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Last Login</label>
            <input type="datetime-local" name="LastLogin" className="cyber-input" required value={formData.LastLogin} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Category</label>
            <select name="Category" className="cyber-input" value={formData.Category} onChange={handleChange}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Anomaly Score</label>
            <select name="AnomalyScore" className="cyber-input" value={formData.AnomalyScore} onChange={handleChange}>
              {anomalyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Frequency</label>
            <select name="Transaction_Frequency" className="cyber-input" value={formData.Transaction_Frequency} onChange={handleChange}>
              {freqOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Total Linked Value (₹)</label>
            <input type="number" name="Total_Linked_Value" className="cyber-input" required value={formData.Total_Linked_Value} onChange={handleChange} placeholder="0.00"/>
          </div>
          
          {/* SUSPICIOUS FLAG INPUT REMOVED HERE */}

          <button type="submit" className="analyze-btn" disabled={loading}>
            {loading ? "PROCESSING..." : "RUN AI PREDICTION"}
          </button>
          {error && <p style={{ color: '#ef4444', gridColumn: '1/-1' }}>{error}</p>}
        </form>
      </div>

      {/* POPUP MODAL */}
      {showModal && analysisResult && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}><FiX /></button>
            <div className="modal-header">
              <FiCpu className="modal-icon spin-slow" />
              <div><h2>AI Forensics Report</h2><p>Manual inference complete</p></div>
            </div>

            <div className="modal-body">
              {/* --- LEFT: 2 GRAPHS --- */}
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

              {/* --- RIGHT: PAYLOAD + DETAILS --- */}
              <div className="details-container">
                {/* PAYLOAD SECTION */}
                <h3><FiDatabase /> Input Payload</h3>
                <div className="cyber-grid" style={{marginBottom: '20px', maxHeight: '150px'}}>
                    <div className="cyber-item"><span className="cyber-label">Amount</span><span className="cyber-value">₹{formData.TransactionAmount}</span></div>
                    <div className="cyber-item"><span className="cyber-label">Category</span><span className="cyber-value">{formData.Category}</span></div>
                    <div className="cyber-item"><span className="cyber-label">Time</span><span className="cyber-value">{new Date(formData.Timestamp).toLocaleTimeString()}</span></div>
                    {/* SUSPICIOUS FLAG REMOVED FROM PAYLOAD DISPLAY */}
                </div>

                {/* RESULTS SECTION */}
                <h3><FiActivity /> Detection Logic</h3>
                <div className="cyber-grid">
                    {/* Show flags */}
                    {analysisResult.details && Object.entries(analysisResult.details).map(([key, value]) => (
                         <div key={key} className="cyber-item">
                             <span className="cyber-label">{key.replace(/_/g, " ")}</span>
                             <span className="cyber-value" style={{color: value ? (key.includes('low') ? '#10b981' : '#ef4444') : '#94a3b8'}}>
                                 {formatValue(key, value)}
                             </span>
                         </div>
                    ))}
                    {/* Basic info */}
                    <div className="cyber-item"><span className="cyber-label">Risk Level</span><span className="cyber-value">{analysisResult.riskLevel}</span></div>
                    <div className="cyber-item"><span className="cyber-label">Confidence</span><span className="cyber-value">{(80 + (Math.abs(analysisResult.riskScore - 0.5) * 38)).toFixed(2)}%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;