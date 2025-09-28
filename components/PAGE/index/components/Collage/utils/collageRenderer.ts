/**
 * COLLAGE RENDERER
 *
 * Core rendering logic for creating collages with React Native Skia
 * Handles canvas setup, background fill, image loading, and export functionality
 */

import { SkImage, ImageFormat } from '@shopify/react-native-skia'
import { File, Paths } from 'expo-file-system'
import { CollageConfig, CollagePosition, ImageFormat as CollageImageFormat, DualImageLayout } from '../types'
import { calculateImageDimensions, calculateCenterPosition, getDefaultCollageConfig } from './imageUtils'

// Reference photo scale factor
const REFERENCE_PHOTO_SCALE = 0.7

/**
 * Calculate the final positioning for the selfie image within the collage (legacy single-image)
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
 * Calculate dual-image layout positions for collage
 * Reference photo: top-right, 70% of canvas size
 * Selfie photo: top-left, filling remaining space
 */
export function calculateDualImageLayout(
  selfieImage: SkImage,
  referenceImage: SkImage,
  config: CollageConfig
): DualImageLayout {
  const canvasWidth = config.canvasWidth
  const canvasHeight = config.canvasHeight

  // Calculate reference photo dimensions (70% of canvas size)
  const referenceMaxWidth = canvasWidth * REFERENCE_PHOTO_SCALE
  const referenceMaxHeight = canvasHeight * REFERENCE_PHOTO_SCALE

  const referenceDimensions = calculateImageDimensions(
    referenceImage.width(),
    referenceImage.height(),
    referenceMaxWidth,
    referenceMaxHeight
  )

  // Position reference photo in top-right corner
  const referencePosition: CollagePosition = {
    x: canvasWidth - referenceDimensions.width, // Right edge
    y: 0, // Top edge
    width: referenceDimensions.width,
    height: referenceDimensions.height,
  }

  // Calculate remaining space for selfie photo (top-left area)
  const selfieMaxWidth = canvasWidth - referenceDimensions.width
  const selfieMaxHeight = canvasHeight

  const selfieDimensions = calculateImageDimensions(
    selfieImage.width(),
    selfieImage.height(),
    selfieMaxWidth,
    selfieMaxHeight
  )

  // Position selfie photo in top-left corner
  const selfiePosition: CollagePosition = {
    x: 0, // Left edge
    y: 0, // Top edge
    width: selfieDimensions.width,
    height: selfieDimensions.height,
  }

  return {
    referencePhoto: referencePosition,
    selfiePhoto: selfiePosition,
  }
}

/**
 * Export collage canvas to a shareable image file using Skia's makeImageSnapshot
 * Supports WebP and PNG formats with configurable quality settings
 */
export async function exportCollageToFile(
  canvasRef: React.RefObject<any>,
  config?: CollageConfig
): Promise<string | null> {
  try {
    if (!canvasRef.current) {
      throw new Error('Canvas ref is not available')
    }

    // Use provided config or default
    const exportConfig = config || getDefaultCollageConfig()

    // Create image snapshot from the canvas
    const image = canvasRef.current.makeImageSnapshot()
    if (!image) {
      throw new Error('Failed to create image snapshot from canvas')
    }

    // Generate filename with timestamp and correct extension
    const timestamp = Date.now()
    const extension = exportConfig.outputFormat
    const filename = `dream-pie-collage-${timestamp}.${extension}`

    // Map our format type to Skia's ImageFormat enum
    const skiaFormat = exportConfig.outputFormat === 'webp' ? ImageFormat.WEBP : ImageFormat.PNG

    // Encode image to bytes with format and quality
    const imageData = image.encodeToBytes(skiaFormat, exportConfig.quality)

    if (!imageData) {
      throw new Error('Failed to encode image data')
    }

    // Create file using correct constructor pattern (following codebase patterns)
    const file = new File(Paths.document, filename)

    // Ensure file exists
    await file.create()

    // Write image data
    await file.write(imageData)

    console.log(`Collage exported successfully as ${exportConfig.outputFormat.toUpperCase()}:`, file.uri)
    console.log(`Quality: ${exportConfig.quality}%, Background: ${exportConfig.backgroundMode}`)
    console.log('File size:', file.size, 'bytes')

    return file.uri
  } catch (error) {
    console.error('Error exporting collage:', error)
    return null
  }
}
