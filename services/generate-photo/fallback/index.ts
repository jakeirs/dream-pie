import { describePose } from './pose-describer'
import { buildRegenerationPrompt } from './prompt-builder'
import { generate } from '../providers/fal'
import { FallbackParams } from '../types'

/**
 * Fallback Regeneration Orchestrator
 *
 * Handles the complete fallback flow when initial validation fails:
 * 1. Describe the pose from the pose image using Gemini
 * 2. Build a new prompt combining pose description + selfie
 * 3. Regenerate the photo using FAL AI with selfie as input
 *
 * This ensures we get a photo of the correct person (from selfie)
 * in the correct pose (from pose description).
 *
 * @param params - Fallback parameters (pose image, selfie, abort signal)
 * @returns URL of the regenerated photo
 */
export async function regenerateWithFallback(params: FallbackParams): Promise<string> {
  const { poseImage, selfieImage, abortSignal } = params

  console.log('🔄 Starting fallback regeneration...')

  try {
    // STEP 1: Describe the pose from the pose image
    console.log('📝 Step 1: Describing pose...')
    const poseImageBase64 = poseImage
    const mimeType = getMimeTypeFromBase64(poseImageBase64)

    const poseDescription = await describePose(poseImageBase64, mimeType, abortSignal)
    console.log('✅ Pose description generated:', poseDescription.substring(0, 100) + '...')

    // STEP 2: Build regeneration prompt
    console.log('🔨 Step 2: Building regeneration prompt...')
    const regenerationPrompt = buildRegenerationPrompt(poseDescription)
    console.log('✅ Regeneration prompt built')

    // STEP 3: Generate photo using selfie + regeneration prompt
    console.log('🎨 Step 3: Generating photo with selfie...')
    const result = await generate({
      imageData: selfieImage,
      prompt: regenerationPrompt,
      abortSignal,
    })

    console.log('✅ Fallback regeneration completed:', result.imageUrl)
    return result.imageUrl
  } catch (error) {
    console.error('❌ Fallback regeneration error:', error)
    throw new Error(
      `Fallback regeneration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Extract MIME type from base64 data URI
 * Falls back to 'image/jpeg' if not found
 */
function getMimeTypeFromBase64(base64: string): string {
  if (base64.startsWith('data:')) {
    const match = base64.match(/^data:([^;]+);/)
    if (match && match[1]) {
      return match[1]
    }
  }
  return 'image/jpeg' // Default fallback
}
