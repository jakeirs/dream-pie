import { Alert } from 'react-native'
import * as Sharing from 'expo-sharing'

export const useImageShare = () => {
  const handleShare = async (imageUri: string, title: string) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync()
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device')
        return
      }

      await Sharing.shareAsync(imageUri, {
        dialogTitle: `Share ${title}`,
        mimeType: 'image/jpeg',
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to share image')
      console.error('Share error:', error)
    }
  }

  return { handleShare }
}
