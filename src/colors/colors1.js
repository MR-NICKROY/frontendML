// Theme: The Cyber-Guardian (Light Mode / Daylight Version)
// Usage: Use this when the user toggles "Light Mode"

export const colors = {
  // --- CORE LAYOUT ---
  background: '#F1F5F9',      // Slate 100 - Soft grey/blue tint (Not harsh white)
  surface: '#FFFFFF',         // Pure White - Cards stand out cleanly
  surfaceHighlight: '#E2E8F0', // Slate 200 - Hover state

  // --- FUNCTIONAL AI COLORS ---
  // Note: We darken these slightly so they are readable against white backgrounds
  primary: '#0891B2',         // Cyan 600 - Readable Cyan
  secondary: '#2563EB',       // Royal Blue - Stronger contrast than the dark mode version
  accent: '#4F46E5',          // Indigo 600

  // --- DATA STATUS ---
  anomaly: '#DC2626',         // Red 600 - Darker red for better visibility on white
  warning: '#D97706',         // Amber 600
  safe: '#059669',            // Emerald 600
  
  // --- TYPOGRAPHY ---
  textPrimary: '#0F172A',     // Slate 900 - Deep Navy (Almost Black)
  textSecondary: '#475569',   // Slate 600 - Medium Grey
  textDisabled: '#94A3B8',    // Slate 400

  // --- BORDERS ---
  border: '#CBD5E1',          // Slate 300 - Crisp definition
  
  // --- TRANSPARENCIES ---
  overlay: 'rgba(255, 255, 255, 0.8)', // White frosting effect
};

// --- CSS SHADOWS & GLOWS ---
// In Light Mode, we use SHADOWS (depth), not GLOWS (light).
export const effects = {
  // Red Shadow for Fraud (Subtle depth, not neon)
  anomalyGlow: '0 4px 14px 0 rgba(220, 38, 38, 0.25)',
  
  // Cyan Shadow for AI
  primaryGlow: '0 4px 14px 0 rgba(8, 145, 178, 0.25)',
  
  // Clean, modern card shadow (like Stripe/Vercel)
  cardShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
};