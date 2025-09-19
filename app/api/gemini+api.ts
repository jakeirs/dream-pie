import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

import { GeminiRequest, GeminiResponse } from '@/types'

export async function POST(request: Request): Promise<Response> {
  try {
    const { message }: GeminiRequest = await request.json()

    if (!message || message.trim().length === 0) {
      return Response.json(
        { error: 'Message is required' } as GeminiResponse,
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey) {
      return Response.json(
        { error: 'Google API key not configured' } as GeminiResponse,
        { status: 500 }
      )
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