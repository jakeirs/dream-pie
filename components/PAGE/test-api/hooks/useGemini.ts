import { useState } from 'react'
import { GeminiRequest, GeminiResponse, GeminiState } from '@/types'

export const useGemini = () => {
  const [geminiState, setGeminiState] = useState<GeminiState>({
    response: null,
    isLoading: false,
    error: null,
  })

  const handleMessageToGemini = async () => {
    setGeminiState({ response: null, isLoading: true, error: null })

    try {
      const request: GeminiRequest = { message: 'Hello, who are you?' }

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      const data: GeminiResponse = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to get response from Gemini')
      }

      setGeminiState({
        response: data.text,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setGeminiState({
        response: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      })
    }
  }

  return {
    geminiState,
    handleMessageToGemini,
  }
}
