export const brandColors = {
  // Backgrounds
  background: '#121212',        // Main app background (dark)
  card: '#FFFFFF',              // Modal/card backgrounds (white)
  cardSecondary: '#1C1C1E',     // Secondary cards (dark gray)

  // Primary Brand Colors
  primary: '#FDE047',           // Yellow CTA buttons (like "Share!")
  primaryForeground: '#000000', // Text on yellow buttons

  // Text Colors
  textPrimary: '#FFFFFF',       // Main headings (white text)
  textSecondary: '#8E8E93',     // Captions, descriptions
  textMuted: '#6B7280',         // Very subtle text

  // Interactive Elements
  accent: '#007AFF',            // Links, active states (iOS blue)
  accentForeground: '#FFFFFF',  // Text on accent elements

  // Status Colors
  success: '#34C759',           // Success states, confirmations
  successForeground: '#FFFFFF',

  warning: '#FF9500',           // Warning states, cautions
  warningForeground: '#FFFFFF',

  error: '#FF453A',             // Error states, delete actions
  errorForeground: '#FFFFFF',

  // UI Elements
  border: '#38383A',            // Dividers, borders
  borderLight: '#E5E5EA',       // Light borders on white backgrounds
};

export type BrandColors = typeof brandColors;