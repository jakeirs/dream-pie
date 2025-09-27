import { useState } from 'react'
import { Alert } from 'react-native'
import * as Sharing from 'expo-sharing'

interface UseImageShareReturn {
  shareImage: (imageUri: string, title?: string) => Promise<void>
  isSharing: boolean
  error: string | null
}

export const useImageShare = (): UseImageShareReturn => {
  const [isSharing, setIsSharing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shareImage = async (imageUri: string, title: string = 'Dream Pie Creation'): Promise<void> => {
    if (isSharing) return

    setIsSharing(true)
    setError(null)

    try {
      // Check if sharing is available on this device
      const isAvailable = await Sharing.isAvailableAsync()
      if (!isAvailable) {
        Alert.alert(
          'Sharing Not Available',
          'Sharing is not available on this device.',
          [{ text: 'OK' }]
        )
        return
      }

      // Share the image using native share dialog
      await Sharing.shareAsync(imageUri, {
        mimeType: 'image/jpeg',
        dialogTitle: `Share your ${title}`,
      })

      // Note: We don't show a success alert here because the native share dialog
      // provides its own feedback, and showing an additional alert would be redundant

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to share image'
      setError(errorMessage)
      console.error('Share error:', err)

      Alert.alert(
        'Share Failed',
        'Unable to share the image. Please try again.',
        [{ text: 'OK' }]
      )
    } finally {
      setIsSharing(false)
    }
  }

  return {
    shareImage,
    isSharing,
    error,
  }
}