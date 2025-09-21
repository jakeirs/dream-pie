import { Asset } from 'expo-asset'
import { File } from 'expo-file-system'

/**
 * Image Conversion Utilities for FAL AI Integration
 *
 * Converts Expo assets and local images to formats compatible with FAL AI API.
 * FAL requires either public URLs or base64 data URIs.
 */


/**
 * Convert any image source to FAL-compatible base64 data URI
 *
 * @param imageSource - Expo asset object, URI string, or Asset instance
 * @returns Promise<string> - Base64 data URI or throws error
 */
export const convertImageForFal = async (imageSource: any): Promise<string> => {
  try {
    // Validate input
    if (!imageSource) {
      throw new Error('Image source is required')
    }

    let assetUri: string

    // Handle different input types
    if (typeof imageSource === 'string') {
      // Already a URI string
      assetUri = imageSource
    } else if (imageSource.uri) {
      // Expo asset object with uri property
      assetUri = imageSource.uri
    } else if (typeof imageSource === 'number') {
      // Expo require() asset number - convert to Asset
      const asset = Asset.fromModule(imageSource)
      await asset.downloadAsync()
      assetUri = asset.localUri || asset.uri
    } else {
      throw new Error('Unsupported image source format')
    }

    // Convert to base64
    const base64Data = await assetToBase64(assetUri)
    return base64Data

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to convert image'
    throw new Error(`Image conversion failed: ${errorMessage}`)
  }
}

/**
 * Convert asset URI to base64 data URI
 *
 * @param assetUri - Asset URI (local or remote)
 * @returns Promise<string> - Base64 data URI
 */
export const assetToBase64 = async (assetUri: string): Promise<string> => {
  try {
    // Create File instance from URI
    const file = new File(assetUri)

    // Read file as base64 using modern API
    const base64String = await file.base64()

    // Determine MIME type from URI
    const mimeType = getMimeTypeFromUri(assetUri)

    // Create data URI
    const dataUri = `data:${mimeType};base64,${base64String}`

    return dataUri

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Base64 conversion failed'
    throw new Error(`Base64 conversion failed: ${errorMessage}`)
  }
}


/**
 * Get MIME type from file URI
 *
 * @param uri - File URI
 * @returns string - MIME type
 */
const getMimeTypeFromUri = (uri: string): string => {
  const extension = uri.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'gif':
      return 'image/gif'
    default:
      return 'image/jpeg' // Default fallback
  }
}

/**
 * Check if image size is reasonable for FAL API
 *
 * @param uri - Image URI
 * @returns Promise<boolean> - True if size is acceptable
 */
export const validateImageSize = async (uri: string): Promise<boolean> => {
  try {
    if (!uri.startsWith('file://')) return true // Can't check remote files

    // Create File instance and check size using modern API
    const file = new File(uri)
    const size = await file.size

    // Check file size (limit to 10MB)
    const MAX_SIZE_MB = 10
    const maxSizeBytes = MAX_SIZE_MB * 1024 * 1024

    return size <= maxSizeBytes

  } catch (error) {
    console.warn('Could not validate image size:', error)
    return true // Allow if we can't check
  }
}