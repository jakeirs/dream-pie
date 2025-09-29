export const brandColors = {
  // Backgrounds
  background: '#FAFAFA', // Main app background (light warm gray)
  card: '#ececef', // Modal/card backgrounds (warm off-white)
  cardSecondary: '#F5F5F4', // Secondary cards (light warm gray)

  // Primary Brand Colors
  primary: '#FDE047', // Yellow CTA buttons (like "Share!")
  primaryForeground: '#000000', // Text on yellow buttons

  // Text Colors
  textPrimary: '#1F1F1F', // Main headings (dark gray)
  textSecondary: '#6B7280', // Captions, descriptions
  textMuted: '#9CA3AF', // Very subtle text
  textLight: '#FAFAFA', // Very subtle text

  // Interactive Elements
  accent: '#007AFF', // Links, active states (iOS blue)
  accentForeground: '#FFFFFF', // Text on accent elements

  // Status Colors
  success: '#34C759', // Success states, confirmations
  successForeground: '#FFFFFF',

  warning: '#FF9500', // Warning states, cautions
  warningForeground: '#FFFFFF',

  error: '#FF453A', // Error states, delete actions
  errorForeground: '#FFFFFF',

  destructive: '#FF453A', // Destructive actions (alias for error)

  // UI Elements
  border: '#E5E7EB', // Dividers, borders
  borderLight: '#F3F4F6', // Light borders on white backgrounds
  muted: '#F5F5F4', // Muted backgrounds
}

export type BrandColors = typeof brandColors
