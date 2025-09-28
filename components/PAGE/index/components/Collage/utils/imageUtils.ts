/**
 * IMAGE UTILITIES
 *
 * Helper functions for image processing in collage generation
 * Handles aspect ratio calculations, scaling, and positioning
 */

import { CollagePosition, CollageConfig } from '../types'

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
 * Get default collage configuration
 */
export function getDefaultCollageConfig(): CollageConfig {
  return {
    canvasWidth: 700,
    canvasHeight: 700,
    backgroundColorHex: '#4ADE80', // Green-400 from Tailwind
    imagePadding: 100,
    imageAreaSize: 500, // 700 - (100 * 2) = 500
  }
}