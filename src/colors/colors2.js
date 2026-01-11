// Theme: Professional Flat (Light Mode)
// Vibe: Corporate, Clean, High Readability (No Gradients)

export const colors = {
  // --- CORE LAYOUT ---
  background: '#F3F4F6',       // Light Gray (Standard app background)
  surface: '#FFFFFF',          // Pure White (Card background)
  surfaceHighlight: '#F9FAFB', // Very light gray (Hover state)

  // --- FUNCTIONAL AI COLORS ---
  primary: '#2563EB',          // Royal Blue (Standard "Link/Action" blue)
  secondary: '#6B7280',        // Neutral Gray (Secondary actions)
  accent: '#4F46E5',           // Indigo (Focus rings / Active states)

  // --- DATA STATUS ---
  anomaly: '#DC2626',          // Red 600 (Solid Red - Critical)
  warning: '#D97706',          // Amber 600 (Solid Orange - Warning)
  safe: '#059669',             // Emerald 600 (Solid Green - Good)
  
  // --- TYPOGRAPHY ---
  textPrimary: '#111827',      // Near Black (Primary Text)
  textSecondary: '#4B5563',    // Dark Gray (Subtitles/Labels)
  textDisabled: '#9CA3AF',     // Light Gray (Disabled text)

  // --- BORDERS ---
  border: '#E5E7EB',           // Light Gray Border (Subtle)
  
  // --- TRANSPARENCIES ---
  overlay: 'rgba(0, 0, 0, 0.5)', // Standard dark dimming overlay
};

// --- CSS SHADOWS ---
// Clean, flat shadows. No colored glows.
export const effects = {
  
  // Red Border for Fraud (No blurry glow)
  anomalyGlow: '0 0 0 2px #DC2626',
  
  // Blue Border for Focus/AI
  primaryGlow: '0 0 0 2px #2563EB',
  
  // Standard drop shadow
  cardShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
};