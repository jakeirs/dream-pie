import { useState } from 'react'
import { GeminiState } from '@/types'
import { useGemini as useSharedGemini } from '@/shared/hooks'

/**
 * Test API Gemini Hook - useState Wrapper for Shared Gemini Hook
 *
 * This hook wraps the shared useGemini hook with useState to maintain
 * backward compatibility with the test-api page interface.
 *
 * For new implementations, use the shared hook directly with zustand stores.
 */
export const useGemini = () => {
  const [geminiState, setGeminiState] = useState<GeminiState>({
    response: null,
    isLoading: false,
    error: null,
  })

  // Initialize shared hook with callbacks to update local state
  const { handleMessageToGemini: sharedHandleMessageToGemini } = useSharedGemini({
    onStart: () => {
      setGeminiState({ response: null, isLoading: true, error: null })
    },
    onSuccess: (response) => {
      setGeminiState({
        response,
        isLoading: false,
        error: null,
      })
    },
    onError: (error) => {
      setGeminiState({
        response: null,
        isLoading: false,
        error,
      })
    },
  })

  const handleMessageToGemini = () => {
    sharedHandleMessageToGemini('Hello, who are you?')
  }

  return {
    geminiState,
    handleMessageToGemini,
  }
}
