/**
 * IMAGE UTILITIES
 *
 * Helper functions for image processing in collage generation
 * Handles aspect ratio calculations, scaling, and positioning
 */

import { CollagePosition, CollageConfig, ImageFormat, BackgroundMode } from '../types'

// COLLAGE LAYOUT SIZE CONSTANTS - Adjust these to change layout proportions
const REFERENCE_PHOTO_SCALE = 0.7 // Reference photo takes 70% of original collage size
const MAX_COLLAGE_DIMENSION = 1000 // Maximum width or height in pixels

/**
 * Calculate scaled image dimensions to fit within the image area while maintaining aspect ratio
 */
export function calculateImageDimensions(
  imageWidth: number,
  imageHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  // Calculate aspect ratios
  const imageAspectRatio = imageWidth / imageHeight
  const containerAspectRatio = maxWidth / maxHeight

  let finalWidth: number
  let finalHeight: number

  if (imageAspectRatio > containerAspectRatio) {
    // Image is wider than container - fit by width
    finalWidth = maxWidth
    finalHeight = maxWidth / imageAspectRatio
  } else {
    // Image is taller than container - fit by height
    finalHeight = maxHeight
    finalWidth = maxHeight * imageAspectRatio
  }

  return { width: finalWidth, height: finalHeight }
}

/**
 * Calculate position to center image within canvas
 */
export function calculateCenterPosition(
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number
): CollagePosition {
  const x = (canvasWidth - imageWidth) / 2
  const y = (canvasHeight - imageHeight) / 2

  return {
    x,
    y,
    width: imageWidth,
    height: imageHeight,
  }
}

/**
 * Calculate collage dimensions based on reference photo aspect ratio
 * Maintains reference photo aspect ratio while respecting maximum dimension constraints
 */
export function calculateCollageDimensions(
  referenceWidth: number,
  referenceHeight: number
): {
  width: number
  height: number
} {
  const aspectRatio = referenceWidth / referenceHeight

  // Scale down if either dimension exceeds maximum
  let finalWidth = referenceWidth
  let finalHeight = referenceHeight

  if (finalWidth > MAX_COLLAGE_DIMENSION || finalHeight > MAX_COLLAGE_DIMENSION) {
    if (aspectRatio > 1) {
      // Wide image - constrain by width
      finalWidth = MAX_COLLAGE_DIMENSION
      finalHeight = MAX_COLLAGE_DIMENSION / aspectRatio
    } else {
      // Tall image - constrain by height
      finalHeight = MAX_COLLAGE_DIMENSION
      finalWidth = MAX_COLLAGE_DIMENSION * aspectRatio
    }
  }

  return {
    width: Math.round(finalWidth),
    height: Math.round(finalHeight),
  }
}

/**
 * Get default collage configuration with WebP and transparent background for optimal file size
 */
export function getDefaultCollageConfig(): CollageConfig {
  return {
    canvasWidth: 700,
    canvasHeight: 700,
    backgroundColorHex: '#4ADE80', // Green-400 from Tailwind
    backgroundMode: 'solid', // Use transparent for smaller file size
    imagePadding: 100,
    imageAreaSize: 500, // 700 - (100 * 2) = 500
    outputFormat: 'webp', // Use WebP for smaller file size
    quality: 85, // Maintain 100% quality as requested
  }
}

/**
 * Get collage configuration for dual-image layout with dynamic sizing
 */
export function getDualImageCollageConfig(
  referenceWidth: number,
  referenceHeight: number
): CollageConfig {
  const dimensions = calculateCollageDimensions(referenceWidth, referenceHeight)

  console.log('Calculated collage dimensions:', dimensions)

  return {
    canvasWidth: dimensions.width,
    canvasHeight: dimensions.height,
    backgroundColorHex: '#4ADE80', // Green-400 from Tailwind
    backgroundMode: 'solid',
    imagePadding: 0, // No padding for tight layout
    imageAreaSize: Math.min(dimensions.width, dimensions.height),
    outputFormat: 'webp',
    quality: 85,
  }
}

/**
 * Get collage configuration with solid background (for legacy compatibility)
 */
export function getSolidBackgroundCollageConfig(): CollageConfig {
  return {
    ...getDefaultCollageConfig(),
    backgroundMode: 'solid',
  }
}
