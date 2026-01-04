import React, { useEffect, useState } from "react";
import { transactionsAPI } from "./APIs/transactions.api.js";
import http from "./APIs/http.js";
import { FaPowerOff, FaEnvelope, FaUserTag, FaCheckCircle } from "react-icons/fa";
import "./Css/Dashboard.css"; // Uses the new responsive user classes

const User = () => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await transactionsAPI.myHistory();
      setHistory(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch history", error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await http.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!user) return <div className="dashboard-container">Please log in.</div>;

  return (
    <div className="dashboard-container">
      
      {/* --- RESPONSIVE USER IDENTITY SECTION --- */}
      <div className="user-card" style={{ '--accent': '#8b5cf6' }}>
        
        {/* Background Decoration */}
        <div className="user-bg-decoration" />

        {/* Header: Avatar + Info */}
        <div className="user-header">
          
          <div className="user-avatar-wrapper">
            <div className="user-avatar-ring" />
            <div className="user-avatar-img-box">
              <img 
                src={`https://avatar.iran.liara.run/public?username=${user.name}`} 
                alt="User Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="user-info">
            <h1 className="user-title">{user.name}</h1>
            
            <div className="user-tech-grid">
              
              <div className="tech-item">
                <span className="tech-label"><FaEnvelope style={{marginRight: '6px'}}/> EMAIL ID</span>
                <span className="tech-value" style={{fontSize: '0.9rem'}}>{user.email}</span>
              </div>
              
              <div className="tech-item">
                <span className="tech-label"><FaUserTag style={{marginRight: '6px'}}/> ACCESS LEVEL</span>
                <span className="tech-value" style={{color: '#10b981'}}>{user.role || "USER"}</span>
              </div>
              
              <div className="tech-item">
                <span className="tech-label"><FaCheckCircle style={{marginRight: '6px'}}/> ACCOUNT STATUS</span>
                <span className="tech-value">ACTIVE</span>
              </div>

            </div>
          </div>
        </div>

        {/* Responsive Logout Button */}
        <button 
          onClick={handleLogout}
          className="logout-btn-user"
        >
          <FaPowerOff size={20} />
          <span>LOGOUT</span>
        </button>
      </div>

      {/* --- HISTORY SECTION --- */}
      <h2 className="chart-title" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
        MANUAL SUBMISSION HISTORY
      </h2>

      {loading ? (
        <p>Loading records...</p>
      ) : history.length === 0 ? (
        <p>No manual transaction history found.</p>
      ) : (
        <div className="transactions-grid">
          {history.map((item) => (
            <div key={item._id} className="transaction-card" style={{ cursor: 'default' }}>
              <div className="card-header">
                <span className="category-badge">{item.Category}</span>
                <span className="amount" style={{ color: item.isFraud ? '#ef4444' : '#10b981' }}>
                  ${item.TransactionAmount.toLocaleString()}
                </span>
              </div>

              <div className="card-details">
                <p>Date: <span>{new Date(item.Timestamp).toLocaleDateString()}</span></p>
                <p>Risk Score: 
                  <span style={{ 
                    color: item.riskScore > 0.5 ? '#ef4444' : '#10b981',
                    fontWeight: 'bold'
                  }}>
                    {(item.riskScore * 100).toFixed(1)}%
                  </span>
                </p>
                <p>Anomaly Score: <span>{item.AnomalyScore}</span></p>
                <p>Status: 
                  <span style={{ 
                    color: item.isFraud ? '#ef4444' : '#10b981', 
                    textTransform: 'uppercase' 
                  }}>
                    {item.isFraud ? "Flagged Fraud" : "Cleared Safe"}
                  </span>
                </p>
              </div>

              <div style={{ 
                marginTop: '15px', 
                borderTop: '1px solid rgba(255,255,255,0.1)', 
                paddingTop: '10px',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                letterSpacing: '1px'
              }}>
                ARCHIVED RECORD
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default User;