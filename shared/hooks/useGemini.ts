import { GeminiRequest, GeminiResponse } from '@/types'

export interface GeminiHookCallbacks {
  onStart?: () => void
  onSuccess?: (response: string) => void
  onError?: (error: string) => void
  onComplete?: () => void
}

/**
 * Shared Gemini AI Hook - Reusable Gemini API Integration
 *
 * This hook provides a flexible interface for Gemini AI interactions
 * that can be used with different state management systems.
 *
 * Usage with callbacks (for zustand stores):
 * const { handleMessageToGemini } = useGemini({
 *   onStart: () => setLoading(true),
 *   onSuccess: (response) => setResponse(response),
 *   onError: (error) => setError(error)
 * })
 *
 * Usage with useState (for local components):
 * See components/PAGE/test-api for useState wrapper example
 */
export const useGemini = (callbacks?: GeminiHookCallbacks) => {
  const handleMessageToGemini = async (message: string = 'Hello, who are you?') => {
    callbacks?.onStart?.()

    try {
      const request: GeminiRequest = { message }

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

      callbacks?.onSuccess?.(data.text)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong with Gemini AI'
      callbacks?.onError?.(errorMessage)
    } finally {
      callbacks?.onComplete?.()
    }
  }

  return {
    handleMessageToGemini,
  }
}