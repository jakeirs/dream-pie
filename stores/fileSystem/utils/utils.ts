/**
 * UNIVERSAL FILE SYSTEM UTILITIES - Core file operations for Dream Pie
 *
 * This module provides reusable file system utilities for managing assets
 * and user-generated content across the Dream Pie app.
 *
 * CORE CAPABILITIES:
 * - Copy bundled assets to device storage (poses, selfies, etc.)
 * - AsyncStorage operations for any data type
 * - File deletion with cleanup
 * - Uses hybrid API: new API for paths (Paths.document), legacy API for operations
 */

import { File, Paths } from 'expo-file-system'
import * as FileSystem from 'expo-file-system/legacy'
import { Asset } from 'expo-asset'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USER_POSES } from '../../AsyncStorage/keys'

// Define common interface for items with imageUrl
interface ImageItem {
  id: string
  name: string
  imageUrl: string
}

/**
 * Copy a bundled asset to file system and return the file URI
 * Using hybrid API: new API for paths, legacy API for copying
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

/**
 * Save item to AsyncStorage
 */
export const saveItemToAsyncStorage = async <T extends ImageItem>(
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
  } catch (error) {
    console.error(`❌ Error saving item ${item.id} to AsyncStorage:`, error)
    throw error
  }
}

/**
 * Load items from AsyncStorage
 */
export const loadItemsFromAsyncStorage = async <T>(asyncStorageKey: string): Promise<T[]> => {
  try {
    const storedItems = await AsyncStorage.getItem(asyncStorageKey)
    return storedItems ? JSON.parse(storedItems) : []
  } catch (error) {
    console.error(`❌ Error loading items from AsyncStorage (${asyncStorageKey}):`, error)
    return []
  }
}

/**
 * Delete item from both file system and AsyncStorage
 * Uses legacy API for file deletion
 */
export const deleteItemFromFileSystem = async <T extends ImageItem>(
  itemId: string,
  asyncStorageKey: string
): Promise<void> => {
  try {
    // Load existing items
    const items = await loadItemsFromAsyncStorage<T>(asyncStorageKey)

    // Find the item to delete
    const itemToDelete = items.find((item) => item.id === itemId)
    if (!itemToDelete) {
      console.warn(`⚠️ Item ${itemId} not found in AsyncStorage (${asyncStorageKey})`)
      return
    }

    // Delete file if it's a file URI (using legacy API)
    if (itemToDelete.imageUrl.startsWith('file://')) {
      await FileSystem.deleteAsync(itemToDelete.imageUrl)
      console.log(`🗑️ Deleted file for item ${itemId}`)
    }

    // Remove from AsyncStorage
    const updatedItems = items.filter((item) => item.id !== itemId)
    await AsyncStorage.setItem(asyncStorageKey, JSON.stringify(updatedItems))

    console.log(`🗑️ Removed item ${itemId} from AsyncStorage (${asyncStorageKey})`)
  } catch (error) {
    console.error(`❌ Error deleting item ${itemId}:`, error)
    throw error
  }
}

// Backward compatibility functions for existing pose code
export const savePoseToAsyncStorage = async (pose: any): Promise<void> => {
  return saveItemToAsyncStorage(pose, USER_POSES)
}

export const loadPosesFromAsyncStorage = async (): Promise<any[]> => {
  return loadItemsFromAsyncStorage(USER_POSES)
}

export const deletePoseFromFileSystem = async (poseId: string): Promise<void> => {
  return deleteItemFromFileSystem(poseId, USER_POSES)
}