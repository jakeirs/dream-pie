/**
 * POSE SYNC UTILITIES - MockData to FileSystem Synchronization
 *
 * This utility automatically syncs mockData poses to file system storage,
 * ensuring AsyncStorage always mirrors mockData with file URIs.
 *
 * CORE CONCEPT:
 * - MockData poses (appAssets imports) → File system copies → AsyncStorage (file URIs)
 * - Single source of truth: mockData
 * - Automatic sync on setPoses()
 * - Uses hybrid API: new API for paths (Paths.document), legacy API for operations (copyAsync)
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
const copyBundledAssetToFileSystem = async (pose: Pose): Promise<string> => {
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
const savePoseToAsyncStorage = async (pose: Pose): Promise<void> => {
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
const loadPosesFromAsyncStorage = async (): Promise<Pose[]> => {
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
const deletePoseFromFileSystem = async (poseId: string): Promise<void> => {
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

/**
 * MAIN SYNC FUNCTION: Sync mockData poses with file system
 * This is called automatically when setPoses() is invoked
 */
export const syncMockDataWithFileSystem = async (mockPoses: Pose[]): Promise<Pose[]> => {
  try {
    console.log(`🔄 Starting pose sync with ${mockPoses.length} mockData poses`)

    // 1. Load current AsyncStorage poses
    const storedPoses = await loadPosesFromAsyncStorage()
    console.log(`📦 Found ${storedPoses.length} poses in AsyncStorage`)

    // 2. Create ID sets for comparison
    const mockIds = new Set(mockPoses.map((p) => p.id))
    const storedIds = new Set(storedPoses.map((p) => p.id))

    // 3. Find poses to ADD (in mock, not in storage)
    const posesToAdd = mockPoses.filter((p) => !storedIds.has(p.id))
    console.log(`➕ Poses to add: ${posesToAdd.length}`)

    // 4. Find poses to REMOVE (in storage, not in mock)
    const posesToRemove = storedPoses.filter((p) => !mockIds.has(p.id))
    console.log(`➖ Poses to remove: ${posesToRemove.length}`)

    // 5. Process additions: copy bundled assets to file system
    for (const mockPose of posesToAdd) {
      console.log(`➕ Adding pose: ${mockPose.name}`)

      try {
        // Copy bundled asset to file system
        const fileUri = await copyBundledAssetToFileSystem(mockPose)

        // Create pose with file URI
        const fsePose: Pose = {
          ...mockPose,
          imageUrl: fileUri, // Replace bundled asset with file URI
        }

        // Save to AsyncStorage
        await savePoseToAsyncStorage(fsePose)
        console.log(`✅ Successfully added pose: ${mockPose.name}`)
      } catch (error) {
        console.error(`❌ Failed to add pose ${mockPose.name}:`, error)
        // Continue with next pose instead of failing entire sync
        continue
      }
    }

    // 6. Process removals: delete files and remove from storage
    for (const poseToRemove of posesToRemove) {
      console.log(`➖ Removing pose: ${poseToRemove.name}`)
      try {
        await deletePoseFromFileSystem(poseToRemove.id)
        console.log(`✅ Successfully removed pose: ${poseToRemove.name}`)
      } catch (error) {
        console.error(`❌ Failed to remove pose ${poseToRemove.name}:`, error)
        // Continue with next pose instead of failing entire sync
        continue
      }
    }

    // 7. Return synced poses (all with file URIs)
    const syncedPoses = await loadPosesFromAsyncStorage()
    console.log(`✅ Sync complete! ${syncedPoses.length} poses with file URIs`)

    return syncedPoses
  } catch (error) {
    console.error('❌ Error during pose sync:', error)

    // Enhanced fallback: try to return existing poses if available
    try {
      const existingPoses = await loadPosesFromAsyncStorage()
      console.log(`🔄 Fallback: returning ${existingPoses.length} existing poses`)
      return existingPoses
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError)
      return []
    }
  }
}
