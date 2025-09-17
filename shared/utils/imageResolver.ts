/**
 * Image Path Resolver Utility
 *
 * Converts string paths to require() statements at render time
 * This prevents the mysterious number transformation issues we were having
 */

import { ImageSourcePropType } from 'react-native'

/**
 * Resolves a string path to a require() statement
 * Only supports known asset paths for security and performance
 */
export const resolveImagePath = (imagePath: string | any): ImageSourcePropType => {
  // Handle cases where imagePath is not a string (fallback to default)
  if (typeof imagePath !== 'string') {
    console.warn('🔄 Non-string imagePath provided:', imagePath, 'using fallback')
    return require('@/assets/selfies/extend-photo.jpeg')
  }

  // Map known asset paths to require() statements
  switch (imagePath) {
    case '@/assets/poses/From-top.jpg':
      return require('@/assets/poses/From-top.jpg')

    case '@/assets/poses/dress.jpg':
      return require('@/assets/poses/dress.jpg')

    case '@/assets/selfies/extend-photo.jpeg':
      return require('@/assets/selfies/extend-photo.jpeg')

    default:
      console.warn('⚠️ Unknown image path:', imagePath, '- using fallback image')
      return require('@/assets/selfies/extend-photo.jpeg')
  }
}

/**
 * Smart image source resolver that handles multiple input types
 * - String paths: Converts to require()
 * - Objects with uri: Returns as-is
 * - Already resolved sources: Returns as-is
 * - Fallback: Default image
 */
export const resolveImageSource = (imageSource: any): ImageSourcePropType => {
  // Handle string paths (our new approach)
  if (typeof imageSource === 'string') {
    return resolveImagePath(imageSource)
  }

  // Handle objects with uri (external images)
  if (typeof imageSource === 'object' && imageSource && imageSource.uri) {
    return imageSource
  }

  // Handle already resolved require() results (numbers)
  if (typeof imageSource === 'number') {
    return imageSource
  }

  // Handle undefined/null
  if (!imageSource) {
    return require('@/assets/selfies/extend-photo.jpeg')
  }

  // Fallback for unknown formats
  console.warn('🔄 Unknown imageSource format:', imageSource, '- using fallback')
  return require('@/assets/selfies/extend-photo.jpeg')
}