import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

import { GeminiRequest, GeminiImageAnalysisRequest, GeminiResponse } from '@/types'

export async function POST(request: Request): Promise<Response> {
  try {
    console.log('🔥 Gemini API route called')
    const body = await request.json()
    console.log('📦 Request body keys:', Object.keys(body))

    // Handle image analysis requests (multimodal)
    if ('imageBase64' in body && 'mimeType' in body) {
      console.log('🖼️ Processing image analysis request')
      const { prompt, imageBase64, mimeType }: GeminiImageAnalysisRequest = body

      console.log('📝 Prompt length:', prompt?.length || 0)
      console.log('🎨 MIME type:', mimeType)
      console.log('📷 Image data length:', imageBase64?.length || 0)

      if (!prompt || prompt.trim().length === 0) {
        console.log('❌ Missing prompt')
        return Response.json({ error: 'Prompt is required for image analysis' } as GeminiResponse, { status: 400 })
      }

      if (!imageBase64 || !mimeType) {
        console.log('❌ Missing image data or mime type')
        return Response.json({ error: 'Image data and mime type are required' } as GeminiResponse, { status: 400 })
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
                mediaType: mimeType
              }
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
