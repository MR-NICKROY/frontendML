import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { FiCpu, FiCode, FiDatabase, FiServer, FiZap } from 'react-icons/fi';

// --- THEME CONFIG ---
const theme = {
  bg: '#0B1120',          
  surface: '#151B2B',     
  primary: '#5865F2',     
  secondary: '#06B6D4',   
  accent: '#10B981',      
  purple: '#8B5CF6',      
  text: '#FFFFFF',        
  textMuted: '#94A3B8',   
  border: '#1E293B',      
};

// --- DATA ---
const techData = [
  { name: 'Python (ML)', usage: 45, color: theme.secondary, icon: FiCpu, desc: 'TensorFlow & Scikit-Learn for Anomaly Detection.' },
  { name: 'React', usage: 30, color: theme.primary, icon: FiCode, desc: 'High-performance UI & Client-side logic.' },
  { name: 'Node.js', usage: 15, color: theme.purple, icon: FiServer, desc: 'Scalable API Gateway.' },
  { name: 'MongoDB/Go', usage: 10, color: theme.accent, icon: FiDatabase, desc: 'High-throughput data ingestion & storage.' },
];

// --- STYLES ---
const styles = `
  .tech-section {
    background-color: ${theme.bg};
    padding: 100px 40px;
    font-family: 'Inter', sans-serif;
    color: ${theme.text};
    overflow: hidden;
    position: relative;
  }

  .tech-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    position: relative;
    z-index: 1; /* Above particles */
  }

  .info-column h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 20px;
    background: linear-gradient(90deg, #fff, ${theme.textMuted});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .info-column p { color: ${theme.textMuted}; margin-bottom: 40px; line-height: 1.6; font-size: 1.1rem; }
  .tech-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }

  .tech-card {
    background-color: ${theme.surface};
    border: 1px solid ${theme.border};
    padding: 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
  }
  .tech-card:hover { border-color: ${theme.primary}; transform: translateX(10px); box-shadow: 0 4px 20px rgba(88, 101, 242, 0.2); }

  .tech-icon-box {
    width: 50px; height: 50px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; flex-shrink: 0;
  }

  .chart-column {
    background-color: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 24px;
    padding: 40px;
    position: relative;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  }

  .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid ${theme.border}; padding-bottom: 20px; }
  .system-status { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: ${theme.accent}; font-weight: 600; }
  .blink { animation: blinker 1.5s linear infinite; }
  @keyframes blinker { 50% { opacity: 0; } }

  .custom-tooltip { background-color: ${theme.bg}; border: 1px solid ${theme.border}; padding: 12px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

  @media (max-width: 1024px) {
    .tech-section { padding: 60px 24px; }
    .tech-container { grid-template-columns: 1fr; gap: 50px; }
    .chart-column { padding: 20px; }
  }
`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p style={{ color: payload[0].payload.color, fontWeight: 'bold', margin: 0 }}>{payload[0].payload.name}</p>
        <p style={{ color: theme.textMuted, margin: '4px 0 0 0', fontSize: '0.9rem' }}>Contribution: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const TechStackSection = () => {
  return (
    <section className="tech-section">
      <style>{styles}</style>
      
      {/* --- GRID + PARTICLES BACKGROUND --- */}
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

      <div className="tech-container">
        {/* LEFT COLUMN */}
        <div className="info-column">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Engineered for Scale.</h2>
            <p>Our hybrid architecture leverages the raw computational power of Python for AI inference while maintaining a lightning-fast, reactive dashboard for end-users.</p>
          </motion.div>

          <div className="tech-grid">
            {techData.map((tech, index) => (
              <motion.div 
                key={tech.name}
                className="tech-card"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="tech-icon-box" style={{ backgroundColor: `${tech.color}20`, color: tech.color }}><tech.icon /></div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{tech.name}</h4>
                  <span style={{ fontSize: '0.9rem', color: theme.textMuted }}>{tech.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <motion.div 
          className="chart-column"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="chart-header">
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>System Resource Allocation</h3>
            <div className="system-status"><FiZap className="blink" /> SYSTEM OPTIMAL</div>
          </div>

          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.border} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: theme.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="usage" radius={[0, 6, 6, 0]} animationDuration={2000}>
                  {techData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: theme.textMuted }}>
            <span>CPU THREADS: 16</span><span>MEMORY: 32GB</span><span>LATENCY: 12ms</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;