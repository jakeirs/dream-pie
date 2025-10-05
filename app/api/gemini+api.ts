import { google } from '@ai-sdk/google'
import { generateText, ImagePart } from 'ai'

import { GeminiRequest, GeminiImageAnalysisRequest, GeminiResponse } from '@/types'

export async function POST(request: Request): Promise<Response> {
  try {
    console.log('🔥 Gemini API route called')
    const body = await request.json()
    console.log('📦 Request body keys:', Object.keys(body))

    // Handle image analysis requests (multimodal)
    if ('imageBase64' in body && 'mediaType' in body) {
      console.log('🖼️ Processing image analysis request')
      const { prompt, imageBase64, mediaType }: GeminiImageAnalysisRequest = body

      console.log('📝 Prompt length:', prompt?.length || 0)
      console.log('🎨 MIME type:', mediaType)
      console.log('📷 Image data length:', imageBase64?.length || 0)

      if (!prompt || prompt.trim().length === 0) {
        console.log('❌ Missing prompt')
        return Response.json({ error: 'Prompt is required for image analysis' } as GeminiResponse, { status: 400 })
      }

      if (!imageBase64 || !mediaType) {
        console.log('❌ Missing image data or media type')
        return Response.json({ error: 'Image data and media type are required' } as GeminiResponse, { status: 400 })
      }

      console.log('🚀 Calling Gemini API...')
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
                mimeType: mediaType
              } as ImagePart
            ]
          }
        ]
      })

      console.log('✅ Gemini API response received, length:', text?.length || 0)
      return Response.json({ text } as GeminiResponse)
    }

    // Handle text-only requests (backwards compatibility)
    const { message }: GeminiRequest = body

    if (!message || message.trim().length === 0) {
      return Response.json({ error: 'Message is required' } as GeminiResponse, { status: 400 })
    }

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: message,
    })

    return Response.json({ text } as GeminiResponse)
  } catch (error) {
    console.error('Gemini API Error:', error)

    return Response.json(
      {
        text: '',
        error: 'Failed to generate response from Gemini',
      } as GeminiResponse,
      { status: 500 }
    )
  }
}
