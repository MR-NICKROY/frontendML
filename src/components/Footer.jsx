import React from 'react';
import { motion } from 'framer-motion'; // Added Import

// --- THEME CONFIG ---
const theme = {
  surface: '#151B2B',     
  textMuted: '#94A3B8',   
  primary: '#5865F2',     
  border: '#1E293B',      
};

// --- STYLES ---
const styles = `
  .simple-footer {
    background-color: ${theme.surface};
    border-top: 1px solid ${theme.border};
    padding: 24px 40px;
    font-family: 'Inter', sans-serif;
    margin-top: auto;
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  /* Content needs z-index to sit above particles */
  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${theme.textMuted};
    font-size: 0.9rem;
    position: relative;
    z-index: 1;
  }

  .footer-links { display: flex; gap: 24px; }
  .footer-links a { color: ${theme.textMuted}; text-decoration: none; transition: color 0.2s ease; }
  .footer-links a:hover { color: ${theme.primary}; }

  @media (max-width: 768px) {
    .simple-footer { padding: 20px; }
    .footer-container { flex-direction: column; gap: 16px; text-align: center; }
  }
`;

const SimpleFooter = () => {
  return (
    <>
      <style>{styles}</style>
      <footer className="simple-footer">
        
        {/* --- GRID + PARTICLES BACKGROUND --- */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.1,
            backgroundImage: `linear-gradient(${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
          {[...Array(100)].map((_, i) => (
            <motion.div key={i}
              style={{
                position: 'absolute', width: 2, height: 2, borderRadius: '50%', background: theme.primary,
                left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [-10, -20, -10], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        <div className="footer-container">
          {/* Left Side: Copyright */}
          <div>
            <span>© 2026 <strong>Fraud Detection.ML</strong>. All rights reserved.</span>
          </div>

          {/* Right Side: Simple Links */}
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default SimpleFooter;