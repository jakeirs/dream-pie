import { analyzeMultipleImages } from '../providers/gemini'
import { PersonComparisonResult } from '../types'
import { COMPARE_PERSON_PROMPT } from '@/shared/prompts/validation/comparePerson'
import { ImageMimeType } from '@/shared/types/image'

/**
 * Compare if same person appears in two images
 *
 * Uses Gemini AI to analyze facial features and determine if the same person
 * appears in both images, with a confidence score.
 *
 * @param generatedPhotoBase64 - Base64 encoded generated photo
 * @param selfieBase64 - Base64 encoded selfie photo
 * @param mediaType - Image MIME type (e.g., 'image/jpeg')
 * @param abortSignal - Optional abort signal for cancellation
 * @returns PersonComparisonResult with isSamePerson boolean and confidence score
 */
export async function comparePerson(
  generatedPhotoBase64: string,
  selfieBase64: string,
  mediaType: ImageMimeType = 'image/jpeg',
  abortSignal?: AbortSignal
): Promise<PersonComparisonResult> {
  try {
    const result = await analyzeMultipleImages({
      prompt: COMPARE_PERSON_PROMPT,
      images: [
        { base64: generatedPhotoBase64, mediaType },
        { base64: selfieBase64, mediaType },
      ],
      abortSignal,
    })

    // Try to parse JSON response
    if (result.parsed) {
      const { isSamePerson, confidence } = result.parsed

      if (typeof isSamePerson === 'boolean' && typeof confidence === 'number') {
        return {
          isSamePerson,
          confidence: Math.max(0, Math.min(1, confidence)), // Clamp to 0-1
          details: result.text,
        }
      }
    }

    // Fallback: Try to extract from text response
    const textLower = result.text.toLowerCase()

    // Extract isSamePerson
    let isSamePerson = false
    if (textLower.includes('"issameperson": true') || textLower.includes('"issameperson":true')) {
      isSamePerson = true
    }

    // Extract confidence (look for decimal number between 0 and 1)
    const confidenceMatch = result.text.match(/"confidence":\s*(0?\.\d+|1\.0|1)/i)
    let confidence = isSamePerson ? 0.5 : 0.3 // Default fallback values

    if (confidenceMatch && confidenceMatch[1]) {
      const parsedConfidence = parseFloat(confidenceMatch[1])
      if (!isNaN(parsedConfidence)) {
        confidence = Math.max(0, Math.min(1, parsedConfidence))
      }
    }

    return {
      isSamePerson,
      confidence,
      details: result.text,
    }
  } catch (error) {
    console.error('Person comparison error:', error)
    throw new Error(
      `Failed to compare person in images: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
