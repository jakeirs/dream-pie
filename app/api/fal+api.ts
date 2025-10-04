import { fal } from '@fal-ai/client'

import { FalRequest, FalResponse, FalRawResponse, ValidationError } from '@/types'

export async function POST(request: Request): Promise<Response> {
  try {
    const { prompt, imageData }: FalRequest = await request.json()

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

    const apiKey = process.env.FAL_KEY

    if (!apiKey) {
      return Response.json(
        {
          imageUrl: '',
          description: '',
          requestId: '',
          contentType: '',
          fileName: '',
          error: 'FAL API key not configured',
        } as FalResponse,
        {
          status: 500,
        }
      )
    }

    // Configure FAL client with API key
    fal.config({
      credentials: apiKey,
    })

    // Call FAL AI nano-banana/edit model with AbortSignal support
    const result = (await fal.subscribe('fal-ai/nano-banana/edit', {
      input: {
        prompt: prompt,
        image_urls: [imageData], // FAL expects array of image URLs | base64 data URIs
        num_images: 1,
        output_format: 'jpeg',
      },
      logs: true,
      abortSignal: request.signal, // Pass AbortSignal for server-side cancellation
      onQueueUpdate: (update: any) => {
        if (update.status === 'IN_PROGRESS') {
          console.log(
            'FAL AI processing:',
            update.logs?.map((log: any) => log.message)
          )
        }
      },
    })) as FalRawResponse

    // Extract the response data
    const { images, description } = result.data

    if (!images || images.length === 0) {
      return Response.json(
        {
          imageUrl: '',
          description: '',
          requestId: result.requestId || '',
          contentType: '',
          fileName: '',
          error: 'No images generated',
        } as FalResponse,
        { status: 500 }
      )
    }

    // SUCCESS
    return Response.json({
      imageUrl: images[0].url,
      description: description || 'Image edited successfully',
      requestId: result.requestId,
      contentType: images[0].content_type,
      fileName: images[0].file_name,
    } as FalResponse)

    // ERRORS FAL API
  } catch (error) {
    console.log('FAL AI Error Details:', JSON.stringify(error, null, 2))

    let errorMessage = 'Failed to generate image with FAL AI'

    if (error instanceof Error) {
      // Handle abort error specifically
      if (error.name === 'AbortError') {
        errorMessage = 'Generation cancelled by user'
      } else {
        // If it's a FAL validation error, extract only the messages for UI
        const validationError = error as ValidationError
        if (validationError.body?.detail) {
          const messages = validationError.body.detail.map((d) => d.msg)
          errorMessage = messages.join('. ')
        } else {
          errorMessage = error.message
        }
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
