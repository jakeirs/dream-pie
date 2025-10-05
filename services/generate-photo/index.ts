import { generate } from './providers/fal'
import { validateGeneration } from './validation'
import { regenerateWithFallback } from './fallback'
import { GeneratePhotoParams, GeneratePhotoResult } from './types'

/**
 * MAIN PHOTO GENERATION SERVICE WITH VALIDATION
 *
 * Complete flow orchestrator for photo generation with AI validation.
 * This is the main entry point for the service.
 *
 * FLOW OVERVIEW:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                                                                 │
 * │  STEP 1: Generate initial photo with FAL AI                    │
 * │  ├─ Input: collageImage + prompt                               │
 * │  └─ Output: generatedPhoto                                     │
 * │                                                                 │
 * │  STEP 2: Validate (if selfie provided)                         │
 * │  ├─ Check 1: Is it a collage? (Gemini)                        │
 * │  ├─ Check 2: Same person? (Gemini)                            │
 * │  └─ Decision: Pass or Fail                                     │
 * │                                                                 │
 * │  STEP 3A: SUCCESS PATH (validation passed)                     │
 * │  └─ Return: generatedPhoto + confidence                        │
 * │                                                                 │
 * │  STEP 3B: FALLBACK PATH (validation failed)                    │
 * │  ├─ Describe pose from poseImage (Gemini)                     │
 * │  ├─ Build new prompt (pose description + identity)            │
 * │  ├─ Regenerate with selfie + new prompt (FAL AI)              │
 * │  └─ Return: newPhoto + confidence=1.0                          │
 * │                                                                 │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @param params - Generation parameters (collage, selfie, pose, prompt, abort)
 * @returns GeneratePhotoResult with final photo and metadata
 */
export async function generatePhotoWithValidation(
  params: GeneratePhotoParams
): Promise<GeneratePhotoResult> {
  const { collageImage, selfieImage, poseImage, prompt, abortSignal } = params

  console.log('🚀 Starting photo generation with validation...')
  console.log('📋 Has selfie for validation:', !!selfieImage)

  try {
    // ═══════════════════════════════════════════════════════════════
    // STEP 1: Generate initial photo with FAL AI
    // ═══════════════════════════════════════════════════════════════
    console.log('🎨 STEP 1: Generating initial photo...')

    const initialResult = await generate({
      imageData: collageImage,
      prompt,
      abortSignal,
    })

    console.log('✅ Initial photo generated:', initialResult.imageUrl)

    // ═══════════════════════════════════════════════════════════════
    // STEP 2: Validate (if selfie provided)
    // ═══════════════════════════════════════════════════════════════
    if (selfieImage) {
      console.log('🔍 STEP 2: Validating generated photo...')

      const validationResult = await validateGeneration({
        generatedPhoto: initialResult.imageUrl,
        selfieImage,
        abortSignal,
      })

      console.log('📊 Validation result:', {
        passed: validationResult.passed,
        isCollage: validationResult.isCollage,
        isSamePerson: validationResult.isSamePerson,
        confidence: validationResult.confidence,
      })

      // ═══════════════════════════════════════════════════════════════
      // STEP 3A: SUCCESS PATH (validation passed)
      // ═══════════════════════════════════════════════════════════════
      if (validationResult.passed) {
        console.log('✅ STEP 3A: Validation passed - returning initial photo')

        return {
          photo: initialResult.imageUrl,
          confidence: validationResult.confidence,
          validationDetails: validationResult,
        }
      }

      // ═══════════════════════════════════════════════════════════════
      // STEP 3B: FALLBACK PATH (validation failed)
      // ═══════════════════════════════════════════════════════════════
      console.log('⚠️ STEP 3B: Validation failed - starting fallback regeneration')
      console.log('📝 Failure reasons:', {
        isCollage: validationResult.isCollage,
        wrongPerson: !validationResult.isSamePerson,
      })

      const fallbackPhoto = await regenerateWithFallback({
        poseImage,
        selfieImage,
        abortSignal,
      })

      console.log('✅ Fallback regeneration completed')

      return {
        photo: fallbackPhoto,
        confidence: 1.0, // Fallback uses selfie directly, so confidence is high
        wasRegenerated: true,
        validationDetails: validationResult,
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // NO VALIDATION PATH (no selfie provided)
    // ═══════════════════════════════════════════════════════════════
    console.log('✅ No validation requested - returning initial photo')

    return {
      photo: initialResult.imageUrl,
    }
  } catch (error) {
    console.error('❌ Photo generation error:', error)

    // Handle abort errors specifically
    if (error instanceof Error && error.name === 'AbortError') {
      throw error // Re-throw abort errors to be handled by caller
    }

    return {
      photo: '',
      error: error instanceof Error ? error.message : 'Failed to generate photo',
    }
  }
}

// Re-export types for convenience
export * from './types'
