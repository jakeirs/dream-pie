/**
 * COPY BUNDLED ASSET TO FILESYSTEM UTILITY
 *
 * Pure FileSystem utility for copying bundled assets (appAssets imports)
 * to the device's persistent storage using Expo FileSystem.
 *
 * WHERE USED:
 * - syncMockDataWithFileSystem.ts: Converting bundled assets to files
 * - Individual stores: Moving bundled assets to permanent storage
 * - Components: Processing imported asset files
 *
 * WHY SEPARATE:
 * - Pure FileSystem operation (no AsyncStorage dependency)
 * - Focused on bundled asset handling only
 * - Reusable for any bundled asset type (poses, selfies, etc.)
 * - Uses hybrid API: new API for paths, legacy API for operations
 *
 * PROCESS:
 * 1. Generate unique filename based on item ID and timestamp
 * 2. Get bundled asset URI using expo-asset
 * 3. Create destination file path using new FileSystem API
 * 4. Copy asset to app's document directory using legacy API
 * 5. Return the permanent file URI
 */

import { File, Paths } from 'expo-file-system'
import * as FileSystem from 'expo-file-system/legacy'
import { Asset } from 'expo-asset'

// Define common interface for items with imageUrl
interface ImageItem {
  id: string
  name: string
  imageUrl: string
}

/**
 * Copy a bundled asset to file system and return the file URI
 * Using hybrid API: new API for paths, legacy API for copying
 *
 * @param item - Item with bundled asset imageUrl (require() import)
 * @param itemType - Type descriptor for logging ('pose', 'selfie', etc.)
 * @returns Permanent file URI in document directory
 */
export const copyBundledAssetToFileSystem = async <T extends ImageItem>(
  item: T,
  itemType: string
): Promise<string> => {
  try {
    // Generate unique filename based on item ID
    const timestamp = Date.now()
    const filename = `${itemType}_${item.id}_${timestamp}.jpg`

    // Get asset URI using expo-asset (works with appAssets imports)
    const asset = Asset.fromModule(item.imageUrl)
    await asset.downloadAsync()

    // Create destination file using new API (Paths.document)
    const destinationFile = new File(Paths.document, filename)

    // Copy asset to app's document directory using legacy API
    await FileSystem.copyAsync({
      from: asset.localUri || asset.uri,
      to: destinationFile.uri, // New API provides the URI for legacy API
    })

    console.log(
      `📁 Copied ${itemType} ${item.id} from bundle to file system: ${destinationFile.uri}`
    )
    return destinationFile.uri
  } catch (error) {
    console.error(`❌ Error copying ${itemType} ${item.id} to file system:`, error)
    throw error
  }
}