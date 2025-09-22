/**
 * ADD TO FILESYSTEM & ASYNCSTORAGE UTILITY
 *
 * Universal utility for adding new assets to both FileSystem and AsyncStorage.
 * Uses latest FileSystem API and supports multiple image source types.
 *
 * SUPPORTED IMAGE SOURCES:
 * - Bundled assets: require() imports from mockData (existing functionality)
 * - Remote URLs: HTTP/HTTPS image URLs from APIs (new functionality)
 * - Local device URIs: Camera/gallery selections (new functionality)
 *
 * USAGE:
 * - poseStore: Add poses from any source to FileSystem + AsyncStorage
 * - selfieStore: Add selfies from any source to FileSystem + AsyncStorage
 * - useCameraButton: Add camera/gallery images consistently
 *
 * PROCESS:
 * 1. Detect image source type (bundled/remote/local)
 * 2. Handle source-specific download/access logic
 * 3. Copy to FileSystem using latest API (File, Paths.document)
 * 4. Create item with file URI
 * 5. Save to AsyncStorage using provided key
 *
 * CONSISTENCY:
 * - Same pattern across all image sources
 * - itemId + asyncStorageKey parameters for universal usage
 * - TypeScript generics for type safety across poses/selfies
 */

import { File, Paths } from 'expo-file-system'
import { Asset } from 'expo-asset'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Define common interface for items with imageUrl
interface ImageItem {
  id: string
  name: string
  imageUrl: string
}

/**
 * IMAGE SOURCE TYPE DETECTION UTILITIES
 */

/**
 * Check if the URI is a remote HTTP/HTTPS URL
 */
const isRemoteUrl = (uri: any): boolean => {
  return typeof uri === 'string' && (uri.startsWith('http://') || uri.startsWith('https://'))
}

/**
 * Check if the URI is a bundled asset (require() import)
 * Bundled assets are typically numbers or objects with uri property
 */
const isBundledAsset = (uri: any): boolean => {
  return typeof uri === 'number' || (typeof uri === 'object' && uri?.uri)
}

/**
 * Check if the URI is a local device file (camera/gallery/file system)
 */
const isLocalUri = (uri: any): boolean => {
  return (
    typeof uri === 'string' &&
    (uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('ph://'))
  )
}

/**
 * REMOTE IMAGE DOWNLOAD UTILITY
 */

/**
 * Download remote image using latest Expo FileSystem API
 * @param url - Remote image URL (http/https)
 * @param filename - Local filename for saved image
 * @returns Local file URI after download
 */
const downloadRemoteImage = async (url: string, filename: string): Promise<string> => {
  try {
    console.log(`🌐 Downloading remote image: ${url}`)

    // Create destination file in document directory
    const destinationFile = new File(Paths.document, filename)

    // Use latest FileSystem API to download remote image
    const downloadedFile = await File.downloadFileAsync(url, destinationFile)

    console.log(`✅ Remote image downloaded: ${downloadedFile.uri}`)
    return downloadedFile.uri
  } catch (error) {
    console.error(`❌ Failed to download remote image ${url}:`, error)
    throw error
  }
}

/**
 * Add new asset to FileSystem and AsyncStorage
 * Supports bundled assets, remote URLs, and local device URIs
 *
 * @param item - Item to add (pose, selfie, etc.)
 * @param asyncStorageKey - AsyncStorage key (USER_POSES, USER_SELFIES, etc.)
 * @param itemType - Type descriptor for logging ('pose', 'selfie', etc.)
 * @returns Item with file URI
 */
export const addToFileSystemAsyncStorage = async <T extends ImageItem>(
  item: T,
  asyncStorageKey: string,
  itemType: string
): Promise<T> => {
  try {
    // Validate required fields
    if (!item.imageUrl) {
      throw new Error(`${itemType} ${item.name} has undefined or empty imageUrl`)
    }

    // Generate unique filename based on item ID and timestamp
    const timestamp = Date.now()
    const filename = `${itemType}_${item.id}_${timestamp}.jpg`

    let sourceUri: string

    // Handle different image source types - CHECK BUNDLED ASSETS FIRST
    if (isBundledAsset(item.imageUrl)) {
      const asset = Asset.fromModule(item.imageUrl)
      await asset.downloadAsync()
      sourceUri = asset.localUri || asset.uri

      // Copy bundled asset to permanent location
      const sourceFile = new File(sourceUri)
      const destinationFile = new File(Paths.document, filename)
      await sourceFile.copy(destinationFile)
      sourceUri = destinationFile.uri
    } else if (isRemoteUrl(item.imageUrl)) {
      // Remote URL: Download using latest FileSystem API
      console.log(`🌐 Processing remote URL: ${item.imageUrl}`)
      sourceUri = await downloadRemoteImage(item.imageUrl, filename)
    } else if (isLocalUri(item.imageUrl)) {
      // Local device URI: Copy to permanent location
      const sourceFile = new File(item.imageUrl)
      const destinationFile = new File(Paths.document, filename)
      await sourceFile.copy(destinationFile)
      sourceUri = destinationFile.uri
    } else {
      // Fallback: treat as local URI
      console.log(`⚠️  Unknown image source, treating as local URI: ${item.imageUrl}`)
      const sourceFile = new File(item.imageUrl)
      const destinationFile = new File(Paths.document, filename)
      await sourceFile.copy(destinationFile)
      sourceUri = destinationFile.uri
    }

    // Create item with final file URI
    const fileSystemItem: T = {
      ...item,
      imageUrl: sourceUri, // Replace original URI with permanent file URI
    }

    // Save to AsyncStorage
    await saveToAsyncStorage(fileSystemItem, asyncStorageKey)
    return fileSystemItem
  } catch (error) {
    console.error(`❌ Error adding ${itemType} ${item.name} to FileSystem + AsyncStorage:`, error)
    throw error
  }
}

/**
 * Helper function to save item to AsyncStorage
 * Consistent with useCameraButton.ts saveToAsyncStorage implementation
 */
const saveToAsyncStorage = async <T extends ImageItem>(
  item: T,
  asyncStorageKey: string
): Promise<void> => {
  try {
    const existingItems = await AsyncStorage.getItem(asyncStorageKey)
    const items = existingItems ? JSON.parse(existingItems) : []

    // Check if item already exists and update it, otherwise add new
    const existingIndex = items.findIndex((i: T) => i.id === item.id)
    if (existingIndex >= 0) {
      items[existingIndex] = item
    } else {
      items.push(item)
    }

    await AsyncStorage.setItem(asyncStorageKey, JSON.stringify(items))
    console.log(`💾 Saved ${item.id} to AsyncStorage (${asyncStorageKey})`)
  } catch (error) {
    console.error(`❌ Error saving item ${item.id} to AsyncStorage:`, error)
    throw error
  }
}
