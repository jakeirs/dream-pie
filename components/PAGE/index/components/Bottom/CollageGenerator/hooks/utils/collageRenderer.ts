import { SkImage, ImageFormat } from '@shopify/react-native-skia'
import { File, Paths } from 'expo-file-system'
import { CollageConfig, CollagePosition, DualImageLayout } from '../../types/types'
import { calculateImageDimensions } from './imageUtils'

// Reference photo scale factor
const REFERENCE_PHOTO_SCALE = 0.55

/**
 * Calculate dual-image layout positions for collage
 * Reference photo: top-right, 70% of canvas size
 * Selfie photo: top-left, filling remaining space
 */
export function calculateDualImageLayout(
  selfieImage: SkImage,
  poseImage: SkImage,
  config: CollageConfig
): DualImageLayout {
  if (!selfieImage || !poseImage) {
    return {
      posePhoto: { x: 0, y: 0, width: 0, height: 0 },
      selfiePhoto: { x: 0, y: 0, width: 0, height: 0 },
    }
  }

  const canvasWidth = config.canvasWidth
  const canvasHeight = config.canvasHeight

  // Calculate reference photo dimensions (70% of canvas size)
  const poseImageMaxWidth = canvasWidth * REFERENCE_PHOTO_SCALE
  const poseImageMaxHeight = canvasHeight * REFERENCE_PHOTO_SCALE

  const poseImageDimensions = calculateImageDimensions(
    poseImage.width(),
    poseImage.height(),
    poseImageMaxWidth,
    poseImageMaxHeight
  )

  // Position reference photo in top-right corner
  const poseImagePosition: CollagePosition = {
    x: canvasWidth - poseImageDimensions.width, // Right edge
    y: 0, // Top edge
    width: poseImageDimensions.width,
    height: poseImageDimensions.height,
  }

  // Calculate remaining space for selfie photo (top-left area)
  const selfieMaxWidth = canvasWidth - poseImageDimensions.width
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
    posePhoto: poseImagePosition,
    selfiePhoto: selfiePosition,
  }
}

/**
 * Export collage canvas to a shareable image file using Skia's makeImageSnapshot
 * Supports WebP and PNG formats with configurable quality settings
 */
export async function exportCollageToFile(
  canvasRef: React.RefObject<any>,
  config: CollageConfig
): Promise<string | null> {
  try {
    if (!canvasRef.current) {
      throw new Error('Canvas ref is not available')
    }

    // Create image snapshot from the canvas
    const image = canvasRef.current.makeImageSnapshot()
    if (!image) {
      throw new Error('Failed to create image snapshot from canvas')
    }

    // Generate filename with timestamp and correct extension
    const timestamp = Date.now()
    const extension = config.outputFormat
    const filename = `dream-pie-collage-${timestamp}.${extension}`

    const skiaFormat = config.outputFormat === 'webp' ? ImageFormat.WEBP : ImageFormat.PNG

    const imageData = image.encodeToBytes(skiaFormat, config.quality)

    if (!imageData) {
      throw new Error('Failed to encode image data')
    }

    const file = new File(Paths.document, filename)

    await file.create()
    await file.write(imageData)

    console.log(`Collage exported successfully as:`, file.uri)
    console.log('File size:', file.size, 'bytes')

    return file.uri
  } catch (error) {
    console.error('Error exporting collage:', error)
    return null
  }
}
