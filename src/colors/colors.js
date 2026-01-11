// Theme: The Cyber-Guardian (Web Version)
// Usage: Import into styled-components, inline styles, or Tailwind config

export const colors = {
  // --- CORE LAYOUT ---
  background: '#0B1120',      // Midnight Navy - Main screen background
  surface: '#151E32',         // Deep Space - Cards, Sidebars, Modals
  surfaceHighlight: '#1E293B', // Hover state for cards

  // --- FUNCTIONAL AI COLORS ---
  primary: '#06B6D4',         // Cyber Cyan - Main AI elements, active tabs
  secondary: '#3B82F6',       // Radar Blue - Standard buttons, links
  accent: '#6366F1',          // Indigo - Subtle highlights

  // --- DATA STATUS ---
  anomaly: '#EF4444',         // Signal Red - FRAUD DETECTED
  warning: '#F59E0B',         // Amber - Suspicious
  safe: '#10B981',            // Neon Mint - Verified / Safe
  
  // --- TYPOGRAPHY ---
  textPrimary: '#FFFFFF',     // Pure White
  textSecondary: '#94A3B8',   // Steel Grey
  textDisabled: '#475569',    // Muted Blue

  // --- BORDERS ---
  border: '#334155',          // Slate
  
  // --- TRANSPARENCIES ---
  overlay: 'rgba(11, 17, 32, 0.8)', 
};

// --- CSS SHADOWS & GLOWS ---
// These are standard CSS strings ready to use in 'boxShadow'
export const effects = {
  // Red Glow for Fraud Cards
  anomalyGlow: '0 0 20px rgba(239, 68, 68, 0.5), inset 0 0 10px rgba(239, 68, 68, 0.1)',
  
  // Cyan Glow for AI Elements
  primaryGlow: '0 0 20px rgba(6, 182, 212, 0.5), inset 0 0 10px rgba(6, 182, 212, 0.1)',
  
  // Subtle shadow for standard cards
  cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
};