import { analyzeImage } from '../providers/gemini'
import { DESCRIBE_POSE_PROMPT } from '@/shared/prompts/generation/describePose'

/**
 * Describe pose from image using Gemini AI
 *
 * Generates a detailed text description of the pose, outfit, setting, and
 * camera angle from a pose image. This description is used to recreate
 * the pose with a different person.
 *
 * @param poseImageBase64 - Base64 encoded pose image
 * @param mimeType - Image MIME type (e.g., 'image/jpeg')
 * @param abortSignal - Optional abort signal for cancellation
 * @returns Detailed text description of the pose
 */
export async function describePose(
  poseImageBase64: string,
  mimeType: string = 'image/jpeg',
  abortSignal?: AbortSignal
): Promise<string> {
  try {
    const result = await analyzeImage({
      prompt: DESCRIBE_POSE_PROMPT,
      imageBase64: poseImageBase64,
      mimeType,
      abortSignal,
    })

    // Return the text description
    const description = result.text.trim()

    if (!description || description.length === 0) {
      throw new Error('Gemini returned empty pose description')
    }

    return description
  } catch (error) {
    console.error('Pose description error:', error)
    throw new Error(
      `Failed to describe pose: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
