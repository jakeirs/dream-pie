/**
 * ZUSTAND STORE LIFECYCLE - Photo Store
 *
 * STATE PURPOSE: Manages user photo selection, processing, and validation
 * WHEN CREATED: User starts photo selection process
 * WHERE CREATED: CreatePage photo selection, camera/gallery actions
 *
 * WHEN UPDATED: Photo selection, processing status, validation results
 * WHERE UPDATED: Photo picker, camera component, processing pipeline
 *
 * STATE EVOLUTION:
 * - INITIALIZE: No photo selected, ready for selection
 * - READ: Display selected photo, show processing status
 * - UPDATE: Select new photo, process image, validate quality
 * - PERSIST: Last selected photo (optional, for session)
 * - RESET: Clear photo on new creation or session end
 *
 * RELATIONSHIPS:
 * - Used by generationStore as input for AI processing
 * - Connected to selfie guidance for photo quality tips
 * - Validates photo before allowing generation
 * SIDE EFFECTS: Photo processing, quality validation, guidance triggers
 */

import { create } from 'zustand'

interface PhotoState {
  // Photo data
  selectedPhoto: string | null
  originalPhoto: string | null // Backup of original
  processedPhoto: string | null // After any processing

  // Processing states
  processingStatus: 'idle' | 'uploading' | 'processing' | 'validating' | 'ready' | 'error'
  processingProgress: number // 0-100

  // Validation
  photoQuality: {
    isValid: boolean
    issues: PhotoQualityIssue[]
    score: number // 0-100
  }

  // Error handling
  error: string | null

  // Actions
  setPhoto: (uri: string) => void
  processPhoto: () => Promise<void>
  validatePhoto: (uri: string) => Promise<PhotoQuality>
  clearPhoto: () => void
  retakePhoto: () => void

  // Processing helpers
  setProcessingStatus: (status: PhotoState['processingStatus']) => void
  setProcessingProgress: (progress: number) => void
}

interface PhotoQualityIssue {
  type: 'lighting' | 'blur' | 'face_detection' | 'resolution' | 'angle'
  message: string
  severity: 'low' | 'medium' | 'high'
}

interface PhotoQuality {
  isValid: boolean
  issues: PhotoQualityIssue[]
  score: number
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
  selectedPhoto: null,
  originalPhoto: null,
  processedPhoto: null,

  processingStatus: 'idle',
  processingProgress: 0,

  photoQuality: {
    isValid: false,
    issues: [],
    score: 0
  },

  error: null,

  setPhoto: (uri) => {
    set({
      selectedPhoto: uri,
      originalPhoto: uri,
      processingStatus: 'uploading',
      processingProgress: 0,
      error: null
    })

    // Start processing pipeline
    get().processPhoto()
  },

  processPhoto: async () => {
    const { selectedPhoto } = get()
    if (!selectedPhoto) return

    try {
      set({ processingStatus: 'processing', processingProgress: 10 })

      // Simulate photo processing steps
      await new Promise(resolve => setTimeout(resolve, 500))
      set({ processingProgress: 40 })

      // Validate photo quality
      set({ processingStatus: 'validating', processingProgress: 60 })
      const quality = await get().validatePhoto(selectedPhoto)

      set({ processingProgress: 80 })
      await new Promise(resolve => setTimeout(resolve, 300))

      // Complete processing
      set({
        processedPhoto: selectedPhoto, // In real app, this might be different
        photoQuality: quality,
        processingStatus: quality.isValid ? 'ready' : 'error',
        processingProgress: 100,
        error: quality.isValid ? null : 'Photo quality issues detected'
      })

    } catch (error) {
      set({
        processingStatus: 'error',
        error: error instanceof Error ? error.message : 'Photo processing failed'
      })
    }
  },

  validatePhoto: async (uri): Promise<PhotoQuality> => {
    // Simulate photo quality analysis
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock validation - in real app this would use ML/AI
    const issues: PhotoQualityIssue[] = []
    let score = 85 // Base score

    // Simulate random quality issues for demo
    const randomIssues = Math.random()
    if (randomIssues < 0.3) {
      issues.push({
        type: 'lighting',
        message: 'Photo appears too dark. Try better lighting.',
        severity: 'medium'
      })
      score -= 15
    }

    if (randomIssues < 0.1) {
      issues.push({
        type: 'blur',
        message: 'Photo is slightly blurry. Hold phone steady.',
        severity: 'high'
      })
      score -= 25
    }

    const isValid = score >= 60 && issues.filter(i => i.severity === 'high').length === 0

    return {
      isValid,
      issues,
      score
    }
  },

  clearPhoto: () => set({
    selectedPhoto: null,
    originalPhoto: null,
    processedPhoto: null,
    processingStatus: 'idle',
    processingProgress: 0,
    photoQuality: { isValid: false, issues: [], score: 0 },
    error: null
  }),

  retakePhoto: () => {
    get().clearPhoto()
    // In real app, this would trigger camera/gallery picker
  },

  setProcessingStatus: (status) => set({ processingStatus: status }),

  setProcessingProgress: (progress) => set({ processingProgress: progress })
}))