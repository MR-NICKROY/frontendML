import React, { useState } from "react";
import { transactionsAPI } from "./APIs/transactions.api.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import "./Css/Dashboard.css";

const Transactions = () => {
  // --- Form State: EXACTLY 8 FIELDS ---
  const [formData, setFormData] = useState({
    TransactionAmount: "",
    Timestamp: "",
    LastLogin: "",
    Category: "Food",
    AnomalyScore: "0.1",
    Transaction_Frequency: "1",
    Total_Linked_Value: "",
    SuspiciousFlag: "0"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  // Options
  const categories = ["Food", "Travel", "Procurement", "Entertainment", "Utilities", "Housing", "Transport", "Other"];
  const anomalyOptions = [
    { label: "Low (0.1)", value: 0.1 },
    { label: "Medium (0.5)", value: 0.5 },
    { label: "High (0.9)", value: 0.9 }
  ];
  const flagOptions = [
    { label: "Safe (0)", value: 0 },
    { label: "Suspicious (1)", value: 1 }
  ];
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
      // Prepare Payload (All 8 Fields Required)
      const payload = {
        TransactionAmount: Number(formData.TransactionAmount),
        Timestamp: formData.Timestamp,
        LastLogin: formData.LastLogin,
        Category: formData.Category,
        AnomalyScore: Number(formData.AnomalyScore),
        Transaction_Frequency: Number(formData.Transaction_Frequency),
        Total_Linked_Value: Number(formData.Total_Linked_Value),
        SuspiciousFlag: Number(formData.SuspiciousFlag)
      };

      const response = await transactionsAPI.addManual(payload);
      setAnalysisResult(response.data);
      
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please check your network or input.");
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (key, value) => {
    if (!value && value !== 0) return "N/A";
    if (key === "Timestamp" || key === "LastLogin" || key === "createdAt") {
      return new Date(value).toLocaleString();
    }
    return value;
  };

  const getChartData = () => {
    if (!analysisResult) return [];
    return [
      { 
        name: "Anomaly", 
        value: analysisResult.AnomalyScore, 
        color: "#f59e0b" 
      },
      { 
        name: "Risk Score", 
        value: analysisResult.riskScore, 
        color: analysisResult.riskScore > 0.5 ? "#ef4444" : "#10b981" 
      }
    ];
  };

  return (
    <div className="dashboard-container">
      
      <div className="filters-section" style={{ display: 'block' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Manual Transaction Analysis</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* 1. Amount */}
          <div className="filter-group">
            <label>Transaction Amount ($)</label>
            <input type="number" name="TransactionAmount" required value={formData.TransactionAmount} onChange={handleChange} placeholder="Amount..."/>
          </div>

          {/* 2. Timestamp */}
          <div className="filter-group">
            <label>Timestamp</label>
            <input type="datetime-local" name="Timestamp" required value={formData.Timestamp} onChange={handleChange} />
          </div>

          {/* 3. Last Login */}
          <div className="filter-group">
            <label>Last Login</label>
            <input type="datetime-local" name="LastLogin" required value={formData.LastLogin} onChange={handleChange} />
          </div>

          {/* 4. Category */}
          <div className="filter-group">
            <label>Category</label>
            <select name="Category" value={formData.Category} onChange={handleChange}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* 5. Anomaly Score */}
          <div className="filter-group">
            <label>Anomaly Score</label>
            <select name="AnomalyScore" value={formData.AnomalyScore} onChange={handleChange}>
              {anomalyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {/* 6. Frequency */}
          <div className="filter-group">
            <label>Frequency</label>
            <select name="Transaction_Frequency" value={formData.Transaction_Frequency} onChange={handleChange}>
              {freqOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {/* 7. Total Linked Value */}
          <div className="filter-group">
            <label>Total Linked Value</label>
            <input type="number" name="Total_Linked_Value" required value={formData.Total_Linked_Value} onChange={handleChange} placeholder="Total Value..."/>
          </div>

          {/* 8. Suspicious Flag */}
          <div className="filter-group">
            <label>Suspicious Flag</label>
            <select name="SuspiciousFlag" value={formData.SuspiciousFlag} onChange={handleChange}>
              {flagOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <button type="submit" className="analyze-btn" disabled={loading}>
              {loading ? "Processing..." : "Analyze with AI"}
            </button>
            {error && <p style={{ color: '#ef4444', marginTop: '10px' }}>{error}</p>}
          </div>
        </form>
      </div>

      {/* --- INLINE RESULTS SECTION --- */}
      {analysisResult && (
        <div style={{ marginTop: '40px', animation: 'fadeIn 0.5s ease' }}>
          
          <h2 className="chart-title">ANALYSIS RESULT</h2>
          
          <div className="analysis-layout">
            
            {/* LEFT COLUMN: Data & AI Score */}
            <div className="ai-dashboard-layout">
              
              {/* Status Banner */}
              <div className={`status-banner ${analysisResult.isFraud ? 'status-danger' : 'status-safe'}`}>
                <h1 className="status-title">
                  {analysisResult.isFraud ? "FRAUD DETECTED" : "LEGITIMATE"}
                </h1>
                <div className="status-subtitle">
                  AI CONFIDENCE: {((1 - Math.abs(0.5 - analysisResult.riskScore) * 2) * 100).toFixed(1)}%
                </div>
              </div>

              {/* Risk Meter */}
              <div className="risk-section">
                <div className="meter-label">
                  <span>RISK ASSESSMENT SCORE</span>
                  <span>{(analysisResult.riskScore * 100).toFixed(2)} / 100</span>
                </div>
                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${analysisResult.riskScore * 100}%`,
                      backgroundColor: analysisResult.riskScore > 0.5 ? '#ef4444' : '#10b981'
                    }}
                  ></div>
                </div>
              </div>

              {/* 8 FIELDS DISPLAY */}
              <div>
                <div className="data-grid-title">TRANSACTION DETAILS</div>
                <div className="tech-grid">
                  <div className="tech-item">
                    <span className="tech-label">Transaction Amount</span>
                    <span className="tech-value">${analysisResult.TransactionAmount}</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-label">Timestamp</span>
                    <span className="tech-value">{formatValue("Timestamp", analysisResult.Timestamp)}</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-label">Last Login</span>
                    <span className="tech-value">{formatValue("LastLogin", analysisResult.LastLogin)}</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-label">Category</span>
                    <span className="tech-value">{analysisResult.Category}</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-label">Anomaly Score</span>
                    <span className="tech-value">{analysisResult.AnomalyScore}</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-label">Frequency</span>
                    <span className="tech-value">{analysisResult.Transaction_Frequency}</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-label">Total Linked Value</span>
                    <span className="tech-value">${analysisResult.Total_Linked_Value}</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-label">Suspicious Flag</span>
                    <span className="tech-value">{analysisResult.SuspiciousFlag}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Chart */}
            <div className="chart-section">
              <h3 style={{marginBottom: '20px', textAlign: 'center'}}>Risk vs Anomaly</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{fontSize: 12}} />
                  <YAxis domain={[0, 1]} stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f3f4f6' }}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                    {getChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;