/**
 * SHARE UTILITIES
 *
 * Helper functions for sharing collage images using expo-sharing
 * Handles share dialog, error handling, and file system operations
 */

import * as Sharing from 'expo-sharing'
import { ShareResult } from '../types'

/**
 * Share an image file using the device's native sharing capabilities
 */
export async function shareCollageImage(imageUri: string): Promise<ShareResult> {
  try {
    // Check if sharing is available on the device
    const isAvailable = await Sharing.isAvailableAsync()

    if (!isAvailable) {
      return {
        success: false,
        error: 'Sharing is not available on this device',
      }
    }

    // Share the image
    await Sharing.shareAsync(imageUri, {
      mimeType: 'image/png',
      dialogTitle: 'Share your Dream Pie collage',
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error sharing collage:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown sharing error',
    }
  }
}

/**
 * Check if sharing is supported on the current platform
 */
export async function isShareSupported(): Promise<boolean> {
  try {
    return await Sharing.isAvailableAsync()
  } catch (error) {
    console.error('Error checking share availability:', error)
    return false
  }
}