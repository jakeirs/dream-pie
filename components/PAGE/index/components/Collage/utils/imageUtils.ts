/**
 * IMAGE UTILITIES
 *
 * Helper functions for image processing in collage generation
 * Handles aspect ratio calculations, scaling, and positioning
 */

import { CollagePosition, CollageConfig, ImageFormat, BackgroundMode } from '../types'

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
 * Get collage configuration with solid background (for legacy compatibility)
 */
export function getSolidBackgroundCollageConfig(): CollageConfig {
  return {
    ...getDefaultCollageConfig(),
    backgroundMode: 'solid',
  }
}
