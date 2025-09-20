import { fal } from '@fal-ai/client'

import { FalRequest, FalResponse } from '@/types'

export async function POST(request: Request): Promise<Response> {
  try {
    const { prompt, imageData }: FalRequest = await request.json()

    if (!prompt || prompt.trim().length === 0) {
      return Response.json({ error: 'Prompt is required' } as FalResponse, { status: 400 })
    }

    if (!imageData || imageData.trim().length === 0) {
      return Response.json({ error: 'Image data is required' } as FalResponse, { status: 400 })
    }

    const apiKey = process.env.FAL_KEY

    if (!apiKey) {
      return Response.json({ error: 'FAL API key not configured' } as FalResponse, {
        status: 500,
      })
    }

    // Configure FAL client with API key
    fal.config({
      credentials: apiKey,
    })

    // Call FAL AI nano-banana/edit model
    const result = await fal.subscribe('fal-ai/nano-banana/edit', {
      input: {
        prompt: prompt,
        image_urls: [imageData], // FAL expects array of image URLs
        num_images: 1,
        output_format: 'jpeg',
      },
      logs: true,
      onQueueUpdate: (update: any) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('FAL AI processing:', update.logs?.map((log: any) => log.message))
        }
      },
    })

    // Extract the response data
    const { images, description } = result.data

    if (!images || images.length === 0) {
      return Response.json(
        {
          imageUrl: '',
          description: '',
          error: 'No images generated',
        } as FalResponse,
        { status: 500 }
      )
    }

    return Response.json({
      imageUrl: images[0].url,
      description: description || 'Image edited successfully',
    } as FalResponse)
  } catch (error) {
    console.error('FAL AI Error:', error)

    return Response.json(
      {
        imageUrl: '',
        description: '',
        error: 'Failed to generate image with FAL AI',
      } as FalResponse,
      { status: 500 }
    )
  }
}