import { useState } from 'react'
import { FalState } from '@/types'
import { useFal as useSharedFal } from '@/shared/hooks'

/**
 * Test API FAL Hook - useState Wrapper for Shared FAL Hook
 *
 * This hook wraps the shared useFal hook with useState to maintain
 * backward compatibility with the test-api page interface.
 *
 * For new implementations, use the shared hook directly with zustand stores.
 */
export const useFal = () => {
  const [falState, setFalState] = useState<FalState>({
    response: null,
    isLoading: false,
    error: null,
  })

  // Initialize shared hook with callbacks to update local state
  const { handleImageEdit: sharedHandleImageEdit } = useSharedFal({
    onStart: () => {
      setFalState({ response: null, isLoading: true, error: null })
    },
    onSuccess: (response) => {
      setFalState({
        response,
        isLoading: false,
        error: null,
      })
    },
    onError: (error) => {
      setFalState({
        response: null,
        isLoading: false,
        error,
      })
    },
  })

  return {
    falState,
    handleImageEdit: sharedHandleImageEdit,
  }
}