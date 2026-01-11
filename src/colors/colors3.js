// Theme: Neuro-Circuit Sentinel
// Inspiration: Human intelligence + AI circuitry
// Usage: Import into styled-components, inline styles, or Tailwind config

export const colors = {
  // --- CORE LAYOUT ---
  background: '#071A33',        // Deep Navy Blue (main background)
  surface: '#0E2A47',           // Elevated panels, sidebar, cards
  surfaceHighlight: '#153A63',  // Hover / active card state

  // --- AI / CIRCUIT COLORS ---
  primary: '#FACC15',           // Neon Circuit Yellow (AI focus, highlights)
  secondary: '#F59E0B',         // Warm Amber (actions, warnings)
  accent: '#22D3EE',            // Soft Cyan (links, indicators)

  // --- STATUS & SIGNALS ---
  anomaly: '#EF4444',           // Critical / Fraud / Error
  warning: '#F97316',           // Suspicious / Attention
  safe: '#22C55E',              // Verified / Safe / Success

  // --- TYPOGRAPHY ---
  textPrimary: '#F8FAFC',       // Near-white (main text)
  textSecondary: '#94A3B8',     // Muted steel blue
  textDisabled: '#475569',      // Disabled / placeholders

  // --- BORDERS & DIVIDERS ---
  border: '#1E3A5F',            // Subtle navy border

  // --- TRANSPARENCY ---
  overlay: 'rgba(7, 26, 51, 0.85)', // Modal & mobile overlay
};
export const effects = {
  // Yellow AI glow (circuits / active states)
  primaryGlow:
    '0 0 18px rgba(250, 204, 21, 0.45), inset 0 0 8px rgba(250, 204, 21, 0.15)',

  // Amber warning glow
  warningGlow:
    '0 0 18px rgba(249, 115, 22, 0.45), inset 0 0 8px rgba(249, 115, 22, 0.15)',

  // Red anomaly glow
  anomalyGlow:
    '0 0 20px rgba(239, 68, 68, 0.5), inset 0 0 10px rgba(239, 68, 68, 0.15)',

  // Standard card shadow
  cardShadow:
    '0 10px 20px rgba(0, 0, 0, 0.45), 0 4px 8px rgba(0, 0, 0, 0.35)',
};
