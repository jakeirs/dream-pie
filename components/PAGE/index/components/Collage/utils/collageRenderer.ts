/**
 * COLLAGE RENDERER
 *
 * Core rendering logic for creating collages with React Native Skia
 * Handles canvas setup, background fill, image loading, and export functionality
 */

import {
  SkImage,
  makeImageFromView,
} from '@shopify/react-native-skia'
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
 * Export collage canvas to a shareable image file
 * This function should be called after the canvas has been rendered
 */
export async function exportCollageToFile(
  canvasRef: React.RefObject<any>
): Promise<string | null> {
  try {
    if (!canvasRef.current) {
      throw new Error('Canvas ref is not available')
    }

    // Create image from the canvas view
    const image = await makeImageFromView(canvasRef)
    if (!image) {
      throw new Error('Failed to create image from canvas')
    }

    // Generate filename with timestamp
    const timestamp = Date.now()
    const filename = `dream-pie-collage-${timestamp}.png`
    const outputPath = `${Paths.document}/${filename}`

    // Create file and write image data
    const file = new File(outputPath)
    const imageData = image.encodeToBytes()

    if (!imageData) {
      throw new Error('Failed to encode image data')
    }

    await file.write(imageData)

    return outputPath
  } catch (error) {
    console.error('Error exporting collage:', error)
    return null
  }
}