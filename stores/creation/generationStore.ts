/**
 * ZUSTAND STORE LIFECYCLE - Generation Store
 *
 * STATE PURPOSE: Manages AI generation process, progress tracking, and results
 * WHEN CREATED: User initiates "Create My Photoshoot" action
 * WHERE CREATED: CreatePage generation trigger, generation screen
 *
 * WHEN UPDATED: Generation progress, step changes, completion/failure
 * WHERE UPDATED: GenerationPage monitoring, AI service callbacks
 *
 * STATE EVOLUTION:
 * - INITIALIZE: Idle state, ready for generation
 * - READ: Monitor progress, display current step, show results
 * - UPDATE: Progress updates, step transitions, result storage
 * - PERSIST: Current generation state (for app backgrounding)
 * - RESET: Complete generation cycle, error recovery
 *
 * RELATIONSHIPS:
 * - Takes input from poseStore and photoStore
 * - Outputs results to galleryStore and resultStore
 * - Consumes credits from subscriptionStore
 * SIDE EFFECTS: Navigation to generation screen, result screen navigation
 */

import { create } from 'zustand'
import { Creation, GenerationProgress, GenerationStep } from '@/types/dream'

interface GenerationState {
  // Generation process
  status: 'idle' | 'generating' | 'complete' | 'error'
  progress: GenerationProgress | null
  currentResult: Creation | null
  generationId: string | null

  // Input data (captured when generation starts)
  inputPose: {
    id: string
    name: string
    category: string
  } | null
  inputPhoto: string | null

  // Error handling
  error: string | null
  retryCount: number

  // Actions
  startGeneration: (poseId: string, poseName: string, poseCategory: string, photoUri: string) => Promise<void>
  updateProgress: (step: GenerationStep, progress: number, message: string) => void
  completeGeneration: (result: Creation) => void
  failGeneration: (error: string) => void
  retryGeneration: () => Promise<void>
  resetGeneration: () => void

  // Helpers
  getEstimatedTimeRemaining: () => number
  canRetry: () => boolean
}

// Mock generation steps with timing
const GENERATION_STEPS: Array<{
  step: GenerationStep
  duration: number // milliseconds
  message: string
}> = [
  {
    step: 'analyzing-photo',
    duration: 2000,
    message: 'Analyzing your photo...'
  },
  {
    step: 'processing-pose',
    duration: 3000,
    message: 'Processing pose reference...'
  },
  {
    step: 'generating-image',
    duration: 8000,
    message: 'Creating your dream photo...'
  },
  {
    step: 'finalizing',
    duration: 2000,
    message: 'Adding final touches...'
  },
  {
    step: 'complete',
    duration: 0,
    message: 'Your photo is ready!'
  }
]

export const useGenerationStore = create<GenerationState>((set, get) => ({
  status: 'idle',
  progress: null,
  currentResult: null,
  generationId: null,

  inputPose: null,
  inputPhoto: null,

  error: null,
  retryCount: 0,

  startGeneration: async (poseId, poseName, poseCategory, photoUri) => {
    const generationId = `gen_${Date.now()}`

    set({
      status: 'generating',
      generationId,
      inputPose: { id: poseId, name: poseName, category: poseCategory },
      inputPhoto: photoUri,
      error: null,
      retryCount: 0,
      progress: {
        currentStep: 'analyzing-photo',
        progress: 0,
        estimatedTimeRemaining: 15, // seconds
        message: 'Starting generation...'
      }
    })

    // Simulate generation process
    try {
      let totalProgress = 0
      const totalDuration = GENERATION_STEPS.reduce((sum, step) => sum + step.duration, 0)

      for (const stepConfig of GENERATION_STEPS) {
        if (stepConfig.step === 'complete') break

        get().updateProgress(stepConfig.step, totalProgress, stepConfig.message)

        // Simulate step processing with progress updates
        const stepStartTime = Date.now()
        while (Date.now() - stepStartTime < stepConfig.duration) {
          await new Promise(resolve => setTimeout(resolve, 200))

          const stepElapsed = Date.now() - stepStartTime
          const stepProgress = Math.min((stepElapsed / stepConfig.duration) * 100, 100)
          const overallProgress = totalProgress + (stepProgress * (stepConfig.duration / totalDuration))

          get().updateProgress(
            stepConfig.step,
            Math.min(overallProgress, 95), // Cap at 95% until complete
            stepConfig.message
          )
        }

        totalProgress += (stepConfig.duration / totalDuration) * 100
      }

      // Generate mock result
      const mockResult: Creation = {
        id: generationId,
        userId: 'user_1', // From user store in real app
        originalPhoto: photoUri,
        selectedPose: { id: poseId, name: poseName, category: poseCategory },
        resultImage: require('@/assets/gallery/img.jpeg'), // Mock result
        status: 'completed',
        generatedAt: new Date().toISOString(),
        processingTime: Math.floor(totalDuration / 1000)
      }

      get().completeGeneration(mockResult)

    } catch (error) {
      get().failGeneration(
        error instanceof Error ? error.message : 'Generation failed'
      )
    }
  },

  updateProgress: (step, progress, message) => set((state) => ({
    progress: {
      currentStep: step,
      progress: Math.min(progress, 100),
      estimatedTimeRemaining: Math.max(0, Math.floor((100 - progress) * 0.15)), // Rough estimate
      message
    }
  })),

  completeGeneration: (result) => set({
    status: 'complete',
    currentResult: result,
    progress: {
      currentStep: 'complete',
      progress: 100,
      estimatedTimeRemaining: 0,
      message: 'Your photo is ready!'
    }
  }),

  failGeneration: (error) => set((state) => ({
    status: 'error',
    error,
    retryCount: state.retryCount + 1
  })),

  retryGeneration: async () => {
    const { inputPose, inputPhoto } = get()
    if (!inputPose || !inputPhoto) return

    await get().startGeneration(
      inputPose.id,
      inputPose.name,
      inputPose.category,
      inputPhoto
    )
  },

  resetGeneration: () => set({
    status: 'idle',
    progress: null,
    currentResult: null,
    generationId: null,
    inputPose: null,
    inputPhoto: null,
    error: null,
    retryCount: 0
  }),

  getEstimatedTimeRemaining: () => {
    const { progress } = get()
    return progress?.estimatedTimeRemaining || 0
  },

  canRetry: () => {
    const { status, retryCount } = get()
    return status === 'error' && retryCount < 3
  }
}))