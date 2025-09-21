import { FalRequest, FalResponse } from '@/types'

export interface FalHookCallbacks {
  onStart?: () => void
  onSuccess?: (response: FalResponse) => void
  onError?: (error: string) => void
  onComplete?: () => void
}

/**
 * Shared FAL AI Hook - Reusable FAL API Integration
 *
 * This hook provides a flexible interface for FAL AI image editing
 * that can be used with different state management systems.
 *
 * Usage with callbacks (for zustand stores):
 * const { handleImageEdit } = useFal({
 *   onStart: () => setLoading(true),
 *   onSuccess: (response) => setResult(response),
 *   onError: (error) => setError(error)
 * })
 *
 * Usage with useState (for local components):
 * See components/PAGE/test-api for useState wrapper example
 */
export const useFal = (callbacks?: FalHookCallbacks) => {
  const handleImageEdit = async (imageData: string, prompt: string = 'change the clothes to black jacket', abortSignal?: AbortSignal) => {
    callbacks?.onStart?.()

    try {
      const request: FalRequest = {
        prompt: prompt,
        imageData: imageData
      }

      const response = await fetch('/api/fal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: abortSignal,
      })

      const data: FalResponse = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to edit image with FAL AI')
      }

      callbacks?.onSuccess?.(data)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        callbacks?.onError?.('Generation cancelled by user')
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong with FAL AI'
        callbacks?.onError?.(errorMessage)
      }
    } finally {
      callbacks?.onComplete?.()
    }
  }

  return {
    handleImageEdit,
  }
}