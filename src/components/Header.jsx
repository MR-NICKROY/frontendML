import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiActivity, FiDatabase, FiCpu, FiInfo, FiMessageSquare, FiShield 
} from 'react-icons/fi';

// --- THEME CONFIG ---
const theme = {
  bg: '#0B1120',          
  surface: '#151B2B',     
  primary: '#5865F2',     
  text: '#FFFFFF',        
  textMuted: '#94A3B8',   
  border: '#1E293B',      
  navHover: '#283245',    
};

// --- STYLES ---
const styles = `
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    height: 80px;
    background-color: ${theme.surface};
    border-bottom: 1px solid ${theme.border};
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    font-family: 'Inter', sans-serif;
    /* REMOVED overflow: hidden to allow mobile menu to show */
  }

  /* Ensure content sits above particles */
  .header-content {
    position: relative;
    z-index: 10;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .logo-area {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.5rem;
    font-weight: 700;
    color: ${theme.text};
    cursor: pointer;
  }

  .desktop-nav {
    display: flex;
    gap: 8px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 8px;
    color: ${theme.textMuted};
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .nav-item:hover {
    background-color: ${theme.navHover};
    color: ${theme.text};
  }

  .mobile-toggle {
    display: none;
    background: none;
    border: none;
    color: ${theme.text};
    font-size: 24px;
    cursor: pointer;
  }

  /* --- RESPONSIVE --- */
  @media (max-width: 1024px) {
    .app-header {
      padding: 0 20px;
      height: 70px;
    }
    .desktop-nav {
      display: none;
    }
    .mobile-toggle {
      display: block;
    }
  }
`;

// Helper to handle smooth scrolling
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

const NavLink = ({ icon: Icon, label, targetId, closeMenu }) => (
  <motion.div 
    className="nav-item"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => {
      scrollToSection(targetId);
      if (closeMenu) closeMenu();
    }}
  >
    <Icon size={18} />
    {label}
  </motion.div>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{styles}</style>
      <header className="app-header">
        
        {/* --- GRID + PARTICLES BACKGROUND --- */}
        {/* Added overflow: hidden HERE instead of .app-header */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* Grid */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.15,
            backgroundImage: `linear-gradient(${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
          {/* Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute', width: 2, height: 2, borderRadius: '50%', background: theme.primary,
                left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [-10, -20, -10], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        {/* --- MAIN CONTENT (Wrapped for Z-Index) --- */}
        <div className="header-content">
          <div className="logo-area" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{ 
              width: '40px', height: '40px', background: `linear-gradient(135deg, ${theme.primary}, #818CF8)`, 
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <FiShield size={24} color="white" />
            </div>
            <span>Fraud Detection<span style={{color: theme.primary}}></span></span>
          </div>

          <nav className="desktop-nav">
            <NavLink icon={FiDatabase} label="AI Features" targetId="ml-section" />
            <NavLink icon={FiCpu} label="Technology" targetId="tech-section" />
            <NavLink icon={FiActivity} label="Graphs" targetId="dashboard-section" />
            <NavLink icon={FiInfo} label="About Team" targetId="about-section" />
            <NavLink icon={FiMessageSquare} label="Feedback" targetId="contact-section" />
          </nav>

          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: theme.surface,
                borderBottom: `1px solid ${theme.border}`,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                zIndex: 999
              }}
            >
              <NavLink icon={FiActivity} label="Graphs" targetId="dashboard-section" closeMenu={() => setIsOpen(false)} />
              <NavLink icon={FiDatabase} label="AI Features" targetId="ml-section" closeMenu={() => setIsOpen(false)} />
              <NavLink icon={FiCpu} label="Technology" targetId="tech-section" closeMenu={() => setIsOpen(false)} />
              <NavLink icon={FiInfo} label="About Team" targetId="about-section" closeMenu={() => setIsOpen(false)} />
              <NavLink icon={FiMessageSquare} label="Feedback" targetId="contact-section" closeMenu={() => setIsOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;