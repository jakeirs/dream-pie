import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

import { GeminiAnalysisParams, GeminiAnalysisResult } from '../types'

/**
 * Gemini AI Provider
 *
 * Handles communication with Gemini AI for image analysis and validation.
 * Abstracts Gemini-specific API details from the main service.
 */

/**
 * Analyze image using Gemini AI with multimodal input
 *
 * @param params - Analysis parameters (prompt, image, mime type, abort signal)
 * @returns Analysis result with text response
 * @throws Error if analysis fails or is cancelled
 */
export async function analyzeImage(params: GeminiAnalysisParams): Promise<GeminiAnalysisResult> {
  const { prompt, imageBase64, mimeType, abortSignal } = params

  // Use AI SDK with multimodal input
  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image',
            image: imageBase64,
            mimeType: mimeType,
          },
        ],
      },
    ],
    abortSignal,
  })

  // Try to parse JSON response if possible
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    // Not JSON, that's okay
    parsed = undefined
  }

  return {
    text,
    parsed,
  }
}

/**
 * Analyze multiple images using Gemini AI
 * Used for person comparison (2 images)
 *
 * @param params - Analysis parameters with multiple images
 * @returns Analysis result with text response
 * @throws Error if analysis fails or is cancelled
 */
export async function analyzeMultipleImages(params: {
  prompt: string
  images: Array<{ base64: string; mimeType: string }>
  abortSignal?: AbortSignal
}): Promise<GeminiAnalysisResult> {
  const { prompt, images, abortSignal } = params

  // Build content array with text prompt followed by images
  const content: any[] = [{ type: 'text', text: prompt }]

  images.forEach((img) => {
    content.push({
      type: 'image',
      image: img.base64,
      mimeType: img.mimeType,
    })
  })

  // Use AI SDK with multimodal input
  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    messages: [
      {
        role: 'user',
        content,
      },
    ],
    abortSignal,
  })

  // Try to parse JSON response if possible
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    // Not JSON, that's okay
    parsed = undefined
  }

  return {
    text,
    parsed,
  }
}
