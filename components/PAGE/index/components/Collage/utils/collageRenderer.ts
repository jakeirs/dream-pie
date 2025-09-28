/**
 * COLLAGE RENDERER
 *
 * Core rendering logic for creating collages with React Native Skia
 * Handles canvas setup, background fill, image loading, and export functionality
 */

import { SkImage } from '@shopify/react-native-skia'
import { File, Paths } from 'expo-file-system'
import { CollageConfig, CollagePosition } from '../types'
import { calculateImageDimensions, calculateCenterPosition } from './imageUtils'

/**
 * Calculate the final positioning for the selfie image within the collage
 */
export function calculateCollageImagePosition(
  image: SkImage,
  config: CollageConfig
): CollagePosition {
  // Get image dimensions
  const imageWidth = image.width()
  const imageHeight = image.height()

  // Calculate scaled dimensions to fit within the image area
  const scaledDimensions = calculateImageDimensions(
    imageWidth,
    imageHeight,
    config.imageAreaSize,
    config.imageAreaSize
  )

  // Calculate center position within the canvas
  const position = calculateCenterPosition(
    config.canvasWidth,
    config.canvasHeight,
    scaledDimensions.width,
    scaledDimensions.height
  )

  return position
}

/**
 * Export collage canvas to a shareable image file using Skia's makeImageSnapshot
 */
export async function exportCollageToFile(canvasRef: React.RefObject<any>): Promise<string | null> {
  try {
    if (!canvasRef.current) {
      throw new Error('Canvas ref is not available')
    }

    // Create image snapshot from the canvas
    const image = canvasRef.current.makeImageSnapshot()
    if (!image) {
      throw new Error('Failed to create image snapshot from canvas')
    }

    // Generate filename with timestamp
    const timestamp = Date.now()
    const filename = `dream-pie-collage-${timestamp}.png`

    // Encode image to bytes (PNG format)
    const imageData = image.encodeToBytes()

    if (!imageData) {
      throw new Error('Failed to encode image data')
    }

    // Create file using correct constructor pattern (following codebase patterns)
    const file = new File(Paths.document, filename)

    // Ensure file exists
    await file.create()

    // Write image data
    await file.write(imageData)

    console.log('Collage exported successfully to:', file.uri)
    console.log('FILES SIZE', file.size, file.info())

    return file.uri
  } catch (error) {
    console.error('Error exporting collage:', error)
    return null
  }
}
