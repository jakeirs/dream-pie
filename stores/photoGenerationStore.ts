/**
 * PHOTO GENERATION STORE LIFECYCLE - Dream Pie AI Photo Generation
 *
 * WHEN CREATED: User initiates photo generation with selected selfie and pose
 * WHERE CREATED: useGeneratePhotoLogic hook, index page "Generate Photo (real)" button
 *
 * WHEN USED: During AI photo generation workflow and result display
 * WHERE USED: components/PAGE/index, useGeneratePhotoLogic hook, result display components
 *
 * HOW DATA EVOLVES:
 * - CREATE: User clicks "Generate Photo (real)" with valid selfie and pose selection
 * - READ: Display generation progress, show results, track used inputs
 * - UPDATE: Processing state changes, result updates, error handling
 * - DELETE: Reset generation state, clear results for new generation
 *
 * RELATIONSHIPS:
 * - Poses: photoGeneration.usedPose -> poseStore.selectedPose (reference)
 * - Selfies: photoGeneration.usedSelfie -> selfieChooserStore.selectedSelfie (reference)
 * - PosePrompts: usedPose.posePromptId -> posePrompts.promptId (lookup for AI prompt)
 * - FAL API: result -> FalResponse (AI generation output)
 */

import { create } from 'zustand'
import { devtools } from '@csark0812/zustand-expo-devtools'
import { FalResponse, Pose, Selfie, PosePrompt } from '@/types'

interface PhotoGenerationStore {
  // Generation State
  isProcessing: boolean

  // Results
  result: FalResponse | null

  // Used Inputs (stored for reference and history)
  usedPose: Pose | null
  usedSelfie: Selfie | null
  usedPosePrompt: PosePrompt | null

  // Error Handling
  error: string | null

  // Actions
  startGeneration: (pose: Pose, selfie: Selfie, posePrompt: PosePrompt) => void
  setResult: (result: FalResponse) => void
  setError: (error: string) => void
  completeGeneration: () => void
  reset: () => void
}

export const usePhotoGenerationStore = create<PhotoGenerationStore>()(
  devtools(
    (set) => ({
      // Initial State
      isProcessing: false,
      result: null,
      usedPose: null,
      usedSelfie: null,
      usedPosePrompt: null,
      error: null,

      // Start Generation - Store inputs and set processing state
      startGeneration: (pose, selfie, posePrompt) =>
        set(
          {
            isProcessing: true,
            result: null,
            error: null,
            usedPose: pose,
            usedSelfie: selfie,
            usedPosePrompt: posePrompt,
          },
          false,
          'startGeneration'
        ),

      // Set Generation Result
      setResult: (result) =>
        set(
          {
            result,
            error: null,
          },
          false,
          'setResult'
        ),

      // Set Error
      setError: (error) =>
        set(
          {
            error,
            result: null,
          },
          false,
          'setError'
        ),

      // Complete Generation - Stop processing
      completeGeneration: () =>
        set(
          {
            isProcessing: false,
          },
          false,
          'completeGeneration'
        ),

      // Reset - Clear all state
      reset: () =>
        set(
          {
            isProcessing: false,
            result: null,
            usedPose: null,
            usedSelfie: null,
            usedPosePrompt: null,
            error: null,
          },
          false,
          'reset'
        ),
    }),
    { name: 'photo-generation-store' }
  )
)