import { useState } from 'react'
import { FalRequest, FalResponse, FalState } from '@/types'

export const useFal = () => {
  const [falState, setFalState] = useState<FalState>({
    response: null,
    isLoading: false,
    error: null,
  })

  const handleImageEdit = async (imageData: string, prompt: string = 'change the clothes to black jacket') => {
    setFalState({ response: null, isLoading: true, error: null })

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
      })

      const data: FalResponse = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to edit image with FAL AI')
      }

      setFalState({
        response: data,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setFalState({
        response: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Something went wrong with FAL AI',
      })
    }
  }

  return {
    falState,
    handleImageEdit,
  }
}