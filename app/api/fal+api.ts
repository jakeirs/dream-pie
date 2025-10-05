import { generatePhotoWithValidation } from '@/services/generate-photo'
import { FalRequest, FalResponse } from '@/types'

export async function POST(request: Request): Promise<Response> {
  try {
    const { prompt, imageData, selfieImage, poseImage }: FalRequest & { selfieImage?: string; poseImage?: string } = await request.json()

    // ERRORS INPUT
    if (!prompt || prompt.trim().length === 0) {
      return Response.json(
        {
          imageUrl: '',
          description: '',
          requestId: '',
          contentType: '',
          fileName: '',
          error: 'Prompt is required',
        } as FalResponse,
        { status: 400 }
      )
    }

    if (!imageData || imageData.trim().length === 0) {
      return Response.json(
        {
          imageUrl: '',
          description: '',
          requestId: '',
          contentType: '',
          fileName: '',
          error: 'Image data is required',
        } as FalResponse,
        { status: 400 }
      )
    }

    if (!poseImage || poseImage.trim().length === 0) {
      return Response.json(
        {
          imageUrl: '',
          description: '',
          requestId: '',
          contentType: '',
          fileName: '',
          error: 'Pose image is required',
        } as FalResponse,
        { status: 400 }
      )
    }

    // ═══════════════════════════════════════════════════════════════
    // MAIN SERVICE CALL - Generate photo with validation
    // ═══════════════════════════════════════════════════════════════
    console.log('🚀 Calling generatePhotoWithValidation service...')

    const result = await generatePhotoWithValidation({
      collageImage: imageData,
      selfieImage,
      poseImage,
      prompt,
      abortSignal: request.signal,
    })

    // Check for service-level errors
    if (result.error) {
      return Response.json(
        {
          imageUrl: '',
          description: '',
          requestId: '',
          contentType: '',
          fileName: '',
          error: result.error,
        } as FalResponse,
        { status: 500 }
      )
    }

    // SUCCESS - Return generated photo with validation details
    return Response.json({
      imageUrl: result.photo,
      description: result.wasRegenerated
        ? 'Photo regenerated with fallback (validation failed)'
        : 'Photo generated successfully',
      requestId: '', // Service doesn't expose this yet
      contentType: 'image/jpeg',
      fileName: 'generated.jpg',
      confidence: result.confidence,
      wasRegenerated: result.wasRegenerated,
    } as FalResponse)

    // ERRORS
  } catch (error) {
    console.log('FAL AI Error Details:', JSON.stringify(error, null, 2))

    let errorMessage = 'Failed to generate image with FAL AI'

    if (error instanceof Error) {
      // Handle abort error specifically
      if (error.name === 'AbortError') {
        errorMessage = 'Generation cancelled by user'
      } else {
        errorMessage = error.message
      }
    }

    return Response.json(
      {
        imageUrl: '',
        description: '',
        requestId: '',
        contentType: '',
        fileName: '',
        error: errorMessage,
      } as FalResponse,
      { status: 500 }
    )
  }
}
