/**
 * IMAGE TYPE DEFINITIONS
 *
 * Centralized image MIME type definitions and utilities.
 * Used across AI processing (Gemini, FAL) for consistent type safety.
 */

/**
 * Supported image MIME types for AI processing
 *
 * Based on formats supported by:
 * - Gemini AI (via @ai-sdk/google)
 * - FAL AI
 * - Common web image formats
 */
export type ImageMimeType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'

/**
 * Extract MIME type from file extension
 *
 * @param extension - File extension (with or without dot)
 * @returns ImageMimeType - Typed MIME type, defaults to 'image/jpeg'
 *
 * @example
 * getMimeTypeFromExtension('jpg') // 'image/jpeg'
 * getMimeTypeFromExtension('.png') // 'image/png'
 */
export function getMimeTypeFromExtension(extension: string): ImageMimeType {
  // Remove leading dot if present
  const ext = extension.startsWith('.') ? extension.slice(1) : extension
  const normalized = ext.toLowerCase()

  switch (normalized) {
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
      return 'image/jpeg' // Safe default for unknown extensions
  }
}

/**
 * Extract MIME type from data URI
 *
 * @param dataUri - Data URI string (e.g., 'data:image/png;base64,...')
 * @returns ImageMimeType - Extracted MIME type, defaults to 'image/jpeg'
 *
 * @example
 * getMimeTypeFromDataUri('data:image/png;base64,iVBORw...') // 'image/png'
 */
export function getMimeTypeFromDataUri(dataUri: string): ImageMimeType {
  if (!dataUri.startsWith('data:')) {
    return 'image/jpeg' // Default if not a data URI
  }

  const match = dataUri.match(/^data:([^;]+);/)
  if (!match || !match[1]) {
    return 'image/jpeg' // Default if pattern doesn't match
  }

  const mimeType = match[1]

  // Validate it's a supported type
  if (isValidImageMimeType(mimeType)) {
    return mimeType
  }

  return 'image/jpeg' // Default fallback
}

/**
 * Extract MIME type from file URI (local or data URI)
 *
 * @param uri - File URI or data URI
 * @returns ImageMimeType - Extracted MIME type
 *
 * @example
 * getMimeTypeFromUri('file:///path/to/image.png') // 'image/png'
 * getMimeTypeFromUri('data:image/webp;base64,...') // 'image/webp'
 */
export function getMimeTypeFromUri(uri: string): ImageMimeType {
  // Check if it's a data URI first
  if (uri.startsWith('data:')) {
    return getMimeTypeFromDataUri(uri)
  }

  // Extract extension from file path
  const extension = uri.split('.').pop()
  if (!extension) {
    return 'image/jpeg' // Default if no extension
  }

  return getMimeTypeFromExtension(extension)
}

/**
 * Type guard: Validate if string is valid ImageMimeType
 *
 * @param value - String to check
 * @returns boolean - True if value is a valid ImageMimeType
 *
 * @example
 * isValidImageMimeType('image/png') // true
 * isValidImageMimeType('image/svg+xml') // false
 */
export function isValidImageMimeType(value: string): value is ImageMimeType {
  return (
    value === 'image/jpeg' ||
    value === 'image/png' ||
    value === 'image/webp' ||
    value === 'image/gif'
  )
}

/**
 * Get file extension from MIME type
 *
 * @param mimeType - Image MIME type
 * @returns string - File extension without dot
 *
 * @example
 * getExtensionFromMimeType('image/jpeg') // 'jpg'
 * getExtensionFromMimeType('image/png') // 'png'
 */
export function getExtensionFromMimeType(mimeType: ImageMimeType): string {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    case 'image/gif':
      return 'gif'
  }
}
