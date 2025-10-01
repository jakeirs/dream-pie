/**
 * Transition Configuration
 *
 * Controls the animation behavior when transitioning from generation
 * (particle effect) to result view (showing PhotoCard)
 *
 * Flow: fullScreen → scaledDown → hiddenParticles
 */

export const TRANSITION_CONFIG = {
  /**
   * Scale values for the PixelatedEffect during transition
   */
  SCALE: {
    FULL_SCREEN: 1.0, // Full screen during generation
    SCALED_DOWN: 0.35, // Scaled down to 35% in result view
  },

  /**
   * Opacity values for fade out
   */
  OPACITY: {
    VISIBLE: 1.0,
    HIDDEN: 0.0,
  },

  /**
   * Animation durations (milliseconds)
   */
  DURATION: {
    SCALE_DOWN: 800, // Time for PixelatedEffect to scale from full to small
    FADE_OUT: 600, // Time for PixelatedEffect to fade out completely
    FADE_IN_RESULT: 400, // Time for PhotoCard to fade in
    DELAY_RESULT: 300, // Delay before showing result (after scale starts)
    DELAY_FADE_OUT: 1500, // Delay before starting fade out (after reaching small)
  },

  /**
   * Spring animation configuration for smooth, natural motion
   */
  SPRING_CONFIG: {
    damping: 18,
    stiffness: 90,
    mass: 1,
  },

  /**
   * Layout positioning for scaled-down effect
   */
  LAYOUT: {
    SCALED_TOP_MARGIN: 20, // Top margin when scaled
    SCALED_SIDE_PADDING: 16, // Horizontal padding when scaled
  },

  /**
   * Border radius for scaled effect container
   */
  BORDER_RADIUS: 24,
} as const

/**
 * Transition State Type
 *
 * fullScreen: Full screen particle effect with information bubbles
 * scaledDown: Scaled down particle effect (35%) with PhotoCard visible
 * hiddenParticles: Particle effect faded out completely, only PhotoCard remains
 */
export type TransitionState = 'fullScreen' | 'scaledDown' | 'hiddenParticles'
