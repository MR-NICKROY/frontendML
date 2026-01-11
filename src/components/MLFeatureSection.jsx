import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiLayers } from 'react-icons/fi';
import Image1 from '../image/image1.gif'
// --- THEME CONFIG ---
const theme = {
  bg: '#0B1120',          
  surface: '#151B2B',     
  primary: '#5865F2',     
  text: '#FFFFFF',        
  textMuted: '#94A3B8',   
  border: '#1E293B',      
};

// --- STYLES ---
const styles = `
  .ml-section {
    background-color: ${theme.bg};
    padding: 80px 40px;
    font-family: 'Inter', sans-serif;
    color: ${theme.text};
    position: relative;
    overflow: hidden;
  }

  .ml-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: stretch;
    position: relative;
    z-index: 1; /* Above particles */
  }

  /* LEFT SIDE */
  .visual-column {
    position: relative;
    background-color: ${theme.surface};
    border-radius: 20px;
    border: 1px solid ${theme.border};
    overflow: hidden;
    display: flex; 
    min-height: 400px; 
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }

  .visual-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* RIGHT SIDE */
  .content-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .badge {
    display: inline-block;
    color: ${theme.primary};
    font-weight: 700;
    font-size: 0.9rem;
    margin-bottom: 16px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  h2 { font-size: 2.5rem; font-weight: 800; line-height: 1.2; margin-bottom: 24px; }
  .description { color: ${theme.textMuted}; font-size: 1.05rem; line-height: 1.6; margin-bottom: 32px; }

  .feature-row { display: flex; gap: 16px; margin-bottom: 20px; }
  .icon-box {
    flex-shrink: 0; width: 48px; height: 48px;
    background-color: ${theme.surface}; border: 1px solid ${theme.border};
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
    color: ${theme.primary};
  }
  .feature-text h4 { font-size: 1.1rem; font-weight: 600; margin-bottom: 4px; }
  .feature-text p { font-size: 0.9rem; color: ${theme.textMuted}; line-height: 1.4; }

  @media (max-width: 1024px) {
    .ml-section { padding: 60px 24px; }
    .ml-container { grid-template-columns: 1fr; height: auto; }
    .visual-column { height: 300px; min-height: auto; order: -1; }
    h2 { font-size: 2rem; }
  }
`;

const MLFeatureSection = () => {
  return (
    <section className="ml-section">
      <style>{styles}</style>
      
      {/* --- GRID + PARTICLES BACKGROUND --- */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4,
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

      <div className="ml-container">
        {/* LEFT: IMAGE */}
        <motion.div 
          className="visual-column"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src={Image1}
            alt="AI Neural Network Visualization" 
            className="visual-image"
          />
        </motion.div>

        {/* RIGHT: TEXT CONTENT */}
        <motion.div 
          className="content-column"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="badge">CyberGuard Neural Engine</span>
          <h2>Unmatched Precision in Anomaly Detection.</h2>
          <p className="description">
            Traditional rule-based systems generate too many false positives. Our unsupervised learning model evolves with new data, identifying zero-day fraud patterns that human analysts miss.
          </p>

          <div className="feature-row">
            <div className="icon-box"><FiActivity size={24} /></div>
            <div className="feature-text">
              <h4>Real-Time Processing</h4>
              <p>Analyzes thousands of transactions per second with sub-10ms latency.</p>
            </div>
          </div>

          <div className="feature-row">
            <div className="icon-box"><FiLayers size={24} /></div>
            <div className="feature-text">
              <h4>Context-Aware Analysis</h4>
              <p>Understands temporal behavior to distinguish legitimate spikes from attacks.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MLFeatureSection;