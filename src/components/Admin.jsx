import React, { useState, useEffect } from "react";
import http from "./APIs/http.js";
import { FaPowerOff, FaShieldAlt, FaServer } from "react-icons/fa";
import "./Css/Dashboard.css"; // Imports the new responsive styles

const Admin = () => {
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setAdminProfile(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await http.post("/api/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!adminProfile) return <div className="dashboard-container" style={{padding:'50px', textAlign:'center', color: '#64748b'}}>Initializing Admin Core...</div>;

  return (
    <div className="dashboard-container">
      
      {/* RESPONSIVE ADMIN IDENTITY CARD */}
      <div className="admin-card">
        
        {/* Background Decoration */}
        <div className="admin-bg-decoration" />

        {/* Header: Avatar + Info */}
        <div className="admin-header">
          
          <div className="admin-avatar-wrapper">
            <div className="admin-avatar-ring" />
            <div className="admin-avatar-img-box">
              <img 
                src={`https://avatar.iran.liara.run/public?username=${adminProfile.name}`} 
                alt="Admin" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="admin-info">
            <h1 className="admin-title">SYSTEM OVERSEER</h1>
            <p className="admin-id">
              <span style={{ opacity: 0.7 }}>ID:</span> {adminProfile.email}
            </p>
            
            <div className="admin-badges">
               <div className="category-badge" style={{ 
                   background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', 
                   border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '6px'
               }}>
                  <FaShieldAlt size={12} /> ROOT ACCESS
               </div>
               <div className="category-badge" style={{ 
                   background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', 
                   border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '6px'
               }}>
                  <FaServer size={12} /> SECURE NODE
               </div>
            </div>
          </div>
        </div>
        
        {/* Responsive Logout Button */}
        <button 
          onClick={handleLogout} 
          className="logout-btn-responsive"
          title="Terminate Session"
        >
          <FaPowerOff size={20} />
          <span>TERMINATE</span>
        </button>
      </div>

    </div>
  );
};

export default Admin;