/**
 * Information Bubble Animation Configuration
 *
 * Controls timing and messages for the floating information component
 * that appears during the generation screen particle animation.
 */

export const INFORMATION_CONFIG = {
  /**
   * Duration the information bubble stays visible (milliseconds)
   * @default 2000ms (2 seconds)
   */
  VISIBLE_DURATION: 2000,

  /**
   * Duration the information bubble stays hidden between appearances (milliseconds)
   * @default 600ms
   */
  HIDDEN_DURATION: 600,

  /**
   * Animation durations for fade in/out transitions
   */
  FADE_IN_DURATION: 300,
  FADE_OUT_DURATION: 300,

  /**
   * Spring animation config for position changes
   * Uses same physics feel as particle system
   */
  SPRING_CONFIG: {
    damping: 15,
    stiffness: 100,
  },

  /**
   * Position variance for subtle movement
   * Bubble moves slightly from center position (not across entire screen)
   */
  POSITION_VARIANCE: {
    X_MAX: 100, // Maximum horizontal shift from center (±150px)
    Y_MAX: 300, // Maximum vertical shift from center (±100px)
  },

  /**
   * Bubble dimensions and repulsion settings
   * Used for particle physics interaction
   */
  BUBBLE_WIDTH: 250, // Approximate bubble width in pixels
  BUBBLE_HEIGHT: 80, // Approximate bubble height in pixels
  REPULSION_PADDING: 100, // Extra space beyond bubble edge for particle repulsion

  /**
   * Messages to display in sequence
   * Cycles through array, repeating when reaching the end
   */
  MESSAGES: [
    'Analyzing your pose...',
    'Why did you choose this outfit?',
    'Adding final touches...',
    'What will you do next with your photo?',
    'Almost ready...',
  ],
} as const
