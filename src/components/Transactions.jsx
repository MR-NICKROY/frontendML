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
import "./Css/Dashboard.css"; // Reuse the high-tech styles

const Transactions = () => {
  // --- Form State ---
  const [formData, setFormData] = useState({
    merchantId: "",
    TransactionAmount: "",
    Timestamp: "",
    Category: "Food",
    AnomalyScore: "0.1",
    Transaction_Frequency: "1",
    SuspiciousFlag: "0"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // --- Modal State ---
  const [showModal, setShowModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // --- Options Generation ---
  const categories = ["Food", "Travel", "Procurement", "Entertainment", "Utilities", "Housing", "Transport", "Other"];
  
  // UPDATED: Predefined Anomaly Score Options
  const anomalyOptions = [
    { label: "Low (0.1)", value: 0.1 },
    { label: "Medium (0.5)", value: 0.5 },
    { label: "High (0.9)", value: 0.9 }
  ];

  // UPDATED: Suspicious Flag Options
  const flagOptions = [
    { label: "Safe (0)", value: 0 },
    { label: "Suspicious (1)", value: 1 }
  ];

  const freqOptions = Array.from({ length: 10 }, (_, i) => i + 1); // 1 to 10

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Convert inputs to correct types for Backend
      const payload = {
        merchantId: formData.merchantId,
        TransactionAmount: Number(formData.TransactionAmount),
        Category: formData.Category,
        AnomalyScore: Number(formData.AnomalyScore),
        Transaction_Frequency: Number(formData.Transaction_Frequency),
        SuspiciousFlag: Number(formData.SuspiciousFlag),
        Timestamp: formData.Timestamp // Send date string directly
      };

      const response = await transactionsAPI.addManual(payload);
      
      // Map API response (including backend-calculated fields) to Dashboard popup
      const formattedResult = {
        input: {
          "Merchant ID": response.data.merchantId,
          "Transaction Amount": response.data.TransactionAmount,
          "Date & Time": response.data.Timestamp,
          "Last Login (Auto)": response.data.LastLogin,
          Category: response.data.Category,
          "Anomaly Score": response.data.AnomalyScore,
          Frequency: response.data.Transaction_Frequency,
          "Total Linked Value (Auto)": response.data.Total_Linked_Value, // Backend Calculated
          "Suspicious Flag": response.data.SuspiciousFlag
        },
        result: {
          is_fraud: response.data.isFraud,
          risk_score: response.data.riskScore
        }
      };

      setAnalysisResult(formattedResult);
      setShowModal(true);
      
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please check your network or input.");
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (key, value) => {
    if (typeof value === 'boolean') return value ? "TRUE" : "FALSE";
    if (key.includes("Date") || key.includes("Login") || key.includes("Timestamp")) {
      return value ? new Date(value).toLocaleString() : "N/A";
    }
    return value;
  };

  const getChartData = () => {
    if (!analysisResult) return [];
    return [
      { 
        name: "Anomaly", 
        value: analysisResult.input["Anomaly Score"], 
        color: "#f59e0b" 
      },
      { 
        name: "Risk Score", 
        value: analysisResult.result.risk_score, 
        color: analysisResult.result.risk_score > 0.5 ? "#ef4444" : "#10b981" 
      }
    ];
  };

  return (
    <div className="dashboard-container">
      
      <div className="filters-section" style={{ display: 'block' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Manual Transaction Analysis</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* Merchant ID */}
          <div className="filter-group">
            <label>Merchant ID</label>
            <input 
              type="text" 
              name="merchantId" 
              required 
              value={formData.merchantId} 
              onChange={handleChange}
              placeholder="e.g. M-1024"
            />
          </div>

          {/* Amount */}
          <div className="filter-group">
            <label>Transaction Amount ($)</label>
            <input 
              type="number" 
              name="TransactionAmount" 
              required 
              value={formData.TransactionAmount} 
              onChange={handleChange}
              placeholder="Enter amount..."
            />
          </div>

          {/* Timestamp (Date & Time) */}
          <div className="filter-group">
            <label>Timestamp (Date & Time)</label>
            <input 
              type="datetime-local" 
              name="Timestamp" 
              required 
              value={formData.Timestamp} 
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="filter-group">
            <label>Category</label>
            <select name="Category" value={formData.Category} onChange={handleChange}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Anomaly Score Dropdown */}
          <div className="filter-group">
            <label>Anomaly Score</label>
            <select name="AnomalyScore" value={formData.AnomalyScore} onChange={handleChange}>
              {anomalyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Suspicious Flag Dropdown */}
          <div className="filter-group">
            <label>Suspicious Flag</label>
            <select name="SuspiciousFlag" value={formData.SuspiciousFlag} onChange={handleChange}>
              {flagOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency */}
          <div className="filter-group">
            <label>Transaction Frequency (1 - 10)</label>
            <select name="Transaction_Frequency" value={formData.Transaction_Frequency} onChange={handleChange}>
              {freqOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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

      {/* --- Analysis Result Modal --- */}
      {showModal && analysisResult && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            
            <h2>AI Security Analysis</h2>
            
            <div className="analysis-layout">
              {/* LEFT COLUMN: Visual AI Result */}
              <div className="ai-dashboard-layout">
                
                {/* Status Banner */}
                <div className={`status-banner ${analysisResult.result.is_fraud ? 'status-danger' : 'status-safe'}`}>
                  <h1 className="status-title">
                    {analysisResult.result.is_fraud ? "FRAUD DETECTED" : "LEGITIMATE"}
                  </h1>
                  <div className="status-subtitle">
                    AI CONFIDENCE: {((1 - Math.abs(0.5 - analysisResult.result.risk_score) * 2) * 100).toFixed(1)}%
                  </div>
                </div>

                {/* Risk Score Meter */}
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

                {/* Input Data Grid */}
                <div>
                  <div className="data-grid-title">ANALYZED PARAMETERS</div>
                  <div className="tech-grid">
                    {Object.entries(analysisResult.input).map(([key, value]) => (
                      <div key={key} className="tech-item">
                        <span className="tech-label">{key}</span>
                        <span className="tech-value">{formatValue(key, value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Chart */}
              <div className="chart-section">
                <h3 style={{marginBottom: '20px', textAlign: 'center'}}>Comparative Metrics</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#9ca3af" tick={{fontSize: 12}} />
                    <YAxis domain={[0, 1]} stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#111827', 
                        borderColor: '#374151', 
                        color: '#f3f4f6',
                        borderRadius: '6px'
                      }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                      {getChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;