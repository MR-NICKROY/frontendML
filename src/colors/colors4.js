export const colors = {
  // --- CORE LAYOUT ---
  background: '#0B1120',       // Midnight Navy
  surface: '#1E293B',          // Slate 800
  surfaceHighlight: '#334155', // Slate 700

  // --- FUNCTIONAL AI COLORS ---
  primary: '#06B6D4',          // Cyan 500 (AI Logic)
  secondary: '#3B82F6',        // Blue 500 (Standard UI)
  accent: '#6366F1',           // Indigo 500 (Highlights)

  // --- DATA STATUS ---
  anomaly: '#EF4444',          // Red 500 (Fraud/Danger)
  warning: '#F59E0B',          // Amber 500 (Suspicious)
  safe: '#10B981',             // Emerald 500 (Verified)
  
  // --- TYPOGRAPHY ---
  textPrimary: '#F8FAFC',      // Slate 50 (Headings)
  textSecondary: '#94A3B8',    // Slate 400 (Labels)
  textDisabled: '#475569',     // Slate 600 (Disabled)

  // --- BORDERS ---
  border: '#1E293B',           // Matching Surface
  
  // --- TRANSPARENCIES ---
  overlay: 'rgba(15, 23, 42, 0.7)', 
};

// --- CSS SHADOWS & GLOWS ---
export const effects = {
  // Red Pulse for Fraud
  anomalyGlow: '0 0 15px rgba(239, 68, 68, 0.5), 0 0 5px rgba(239, 68, 68, 0.2)',
  
  // Cyan Glow for AI Elements
  primaryGlow: '0 0 15px rgba(6, 182, 212, 0.5), 0 0 5px rgba(6, 182, 212, 0.2)',
  
  // Subtle shadow for standard cards
  cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.15)',
};