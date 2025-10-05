import { analyzeImage } from '../providers/gemini'
import { CollageCheckResult } from '../types'
import { CHECK_COLLAGE_PROMPT } from '@/shared/prompts/validation/checkCollage'

/**
 * Check if generated image is a collage
 *
 * Uses Gemini AI to analyze the image and determine if it's a collage
 * (side-by-side comparison) or a single unified photograph.
 *
 * @param imageBase64 - Base64 encoded image to check
 * @param mimeType - Image MIME type (e.g., 'image/jpeg')
 * @param abortSignal - Optional abort signal for cancellation
 * @returns CollageCheckResult with isCollage boolean
 */
export async function checkCollage(
  imageBase64: string,
  mimeType: string = 'image/jpeg',
  abortSignal?: AbortSignal
): Promise<CollageCheckResult> {
  try {
    const result = await analyzeImage({
      prompt: CHECK_COLLAGE_PROMPT,
      imageBase64,
      mimeType,
      abortSignal,
    })

    // Try to parse JSON response
    if (result.parsed && typeof result.parsed.isCollage === 'boolean') {
      return {
        isCollage: result.parsed.isCollage,
        details: result.text,
      }
    }

    // Fallback: Check text response for boolean keywords
    const textLower = result.text.toLowerCase()
    const isCollage =
      textLower.includes('"iscollage": true') ||
      textLower.includes('"iscollage":true') ||
      textLower.includes('true')

    return {
      isCollage,
      details: result.text,
    }
  } catch (error) {
    console.error('Collage check error:', error)
    throw new Error(
      `Failed to check if image is collage: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
