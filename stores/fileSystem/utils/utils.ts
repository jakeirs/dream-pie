/**
 * FILE SYSTEM UTILITIES - Core file operations for Dream Pie
 *
 * This module provides reusable file system utilities for managing assets
 * and user-generated content across the Dream Pie app.
 *
 * CORE CAPABILITIES:
 * - Copy bundled assets to device storage
 * - AsyncStorage operations for pose data
 * - File deletion with cleanup
 * - Uses hybrid API: new API for paths (Paths.document), legacy API for operations
 */

import { File, Paths } from 'expo-file-system'
import * as FileSystem from 'expo-file-system/legacy'
import { Asset } from 'expo-asset'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { USER_POSES } from '@/stores/AsyncStorage/keys'
import { Pose } from '@/types/dream/pose'

/**
 * Copy a bundled asset to file system and return the file URI
 * Using hybrid API: new API for paths, legacy API for copying
 */
export const copyBundledAssetToFileSystem = async (pose: Pose): Promise<string> => {
  try {
    // Generate unique filename based on pose ID
    const timestamp = Date.now()
    const filename = `pose_${pose.id}_${timestamp}.jpg`

    // Get asset URI using expo-asset (works with appAssets imports)
    const asset = Asset.fromModule(pose.imageUrl)
    await asset.downloadAsync()

    // Create destination file using new API (Paths.document)
    const destinationFile = new File(Paths.document, filename)

    // Copy asset to app's document directory using legacy API
    await FileSystem.copyAsync({
      from: asset.localUri || asset.uri,
      to: destinationFile.uri, // New API provides the URI for legacy API
    })

    console.log(
      `📁 Copied pose ${pose.id} from bundle to file system: ${destinationFile.uri}`
    )
    return destinationFile.uri
  } catch (error) {
    console.error(`❌ Error copying pose ${pose.id} to file system:`, error)
    throw error
  }
}

/**
 * Save pose to AsyncStorage
 */
export const savePoseToAsyncStorage = async (pose: Pose): Promise<void> => {
  try {
    const existingPoses = await AsyncStorage.getItem(USER_POSES)
    const poses = existingPoses ? JSON.parse(existingPoses) : []

    // Check if pose already exists and update it, otherwise add new
    const existingIndex = poses.findIndex((p: Pose) => p.id === pose.id)
    if (existingIndex >= 0) {
      poses[existingIndex] = pose
    } else {
      poses.push(pose)
    }

    await AsyncStorage.setItem(USER_POSES, JSON.stringify(poses))
  } catch (error) {
    console.error(`❌ Error saving pose ${pose.id} to AsyncStorage:`, error)
    throw error
  }
}

/**
 * Load poses from AsyncStorage
 */
export const loadPosesFromAsyncStorage = async (): Promise<Pose[]> => {
  try {
    const storedPoses = await AsyncStorage.getItem(USER_POSES)
    return storedPoses ? JSON.parse(storedPoses) : []
  } catch (error) {
    console.error('❌ Error loading poses from AsyncStorage:', error)
    return []
  }
}

/**
 * Delete pose from both file system and AsyncStorage
 * Uses legacy API for file deletion
 */
export const deletePoseFromFileSystem = async (poseId: string): Promise<void> => {
  try {
    // Load existing poses
    const poses = await loadPosesFromAsyncStorage()

    // Find the pose to delete
    const poseToDelete = poses.find((p) => p.id === poseId)
    if (!poseToDelete) {
      console.warn(`⚠️ Pose ${poseId} not found in AsyncStorage`)
      return
    }

    // Delete file if it's a file URI (using legacy API)
    if (poseToDelete.imageUrl.startsWith('file://')) {
      await FileSystem.deleteAsync(poseToDelete.imageUrl)
      console.log(`🗑️ Deleted file for pose ${poseId}`)
    }

    // Remove from AsyncStorage
    const updatedPoses = poses.filter((p) => p.id !== poseId)
    await AsyncStorage.setItem(USER_POSES, JSON.stringify(updatedPoses))

    console.log(`🗑️ Removed pose ${poseId} from AsyncStorage`)
  } catch (error) {
    console.error(`❌ Error deleting pose ${poseId}:`, error)
    throw error
  }
}