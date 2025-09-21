/**
 * SYNC MOCK DATA WITH FILE SYSTEM - Main synchronization logic
 *
 * This module handles the core synchronization between mockData poses
 * and the device file system, ensuring AsyncStorage always mirrors mockData
 * with proper file URIs.
 *
 * PROCESS FLOW:
 * 1. Load current AsyncStorage poses
 * 2. Compare with mockData poses
 * 3. Add missing poses (copy assets to file system)
 * 4. Remove obsolete poses (delete files and storage)
 * 5. Return synced poses with file URIs
 *
 * CALLED BY:
 * - poseStore.setPoses() - Automatic sync when mockData is loaded
 */

import { Pose } from '@/types/dream/pose'
import {
  copyBundledAssetToFileSystem,
  savePoseToAsyncStorage,
  loadPosesFromAsyncStorage,
  deletePoseFromFileSystem,
} from './utils/utils'

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

    console.log('syncedPoses', JSON.stringify(syncedPoses, null, 2))

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
