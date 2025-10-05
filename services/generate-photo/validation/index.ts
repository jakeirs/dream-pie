import { checkCollage } from './collage-check'
import { comparePerson } from './person-comparison'
import { ValidationParams, ValidationResult } from '../types'
import { getMimeTypeFromDataUri } from '@/shared/types/image'

/**
 * Validation Orchestrator
 *
 * Coordinates both collage check and person comparison validations.
 * Runs checks in parallel for performance, then combines results.
 *
 * Validation passes if:
 * - Generated photo is NOT a collage
 * - Generated photo has the SAME person as selfie
 *
 * @param params - Validation parameters (generated photo, selfie, abort signal)
 * @returns ValidationResult with overall pass/fail and details
 */
export async function validateGeneration(params: ValidationParams): Promise<ValidationResult> {
  const { generatedPhoto, selfieImage, abortSignal } = params

  try {
    // TODO: Convert URLs to base64 if needed
    // For now, assuming both are base64 strings
    const generatedPhotoBase64 = generatedPhoto
    const selfieBase64 = selfieImage

    // Determine MIME type from base64 prefix or default to jpeg
    const mediaType = getMimeTypeFromDataUri(generatedPhotoBase64)

    // Run both validations in parallel for performance
    const [collageResult, comparisonResult] = await Promise.all([
      checkCollage(generatedPhotoBase64, mediaType, abortSignal),
      comparePerson(generatedPhotoBase64, selfieBase64, mediaType, abortSignal),
    ])

    // Validation passes if NOT a collage AND same person
    const passed = !collageResult.isCollage && comparisonResult.isSamePerson

    return {
      passed,
      isCollage: collageResult.isCollage,
      isSamePerson: comparisonResult.isSamePerson,
      confidence: comparisonResult.confidence,
      details: `Collage: ${collageResult.isCollage ? 'Yes' : 'No'}, Same Person: ${comparisonResult.isSamePerson ? 'Yes' : 'No'}, Confidence: ${comparisonResult.confidence.toFixed(2)}`,
    }
  } catch (error) {
    console.error('Validation error:', error)

    // Return failed validation with error details
    return {
      passed: false,
      isCollage: false,
      isSamePerson: false,
      confidence: 0,
      details: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

