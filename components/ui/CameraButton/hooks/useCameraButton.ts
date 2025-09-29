import { useState } from 'react'
import { Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

import { Selfie } from '@/types/dream/selfie'

interface UseCameraButtonProps {
  onPhotoSelected: (selfie: Selfie) => void
}

export const useCameraButton = ({ onPhotoSelected }: UseCameraButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const showImagePicker = () => {
    setShowAlert(true)
  }

  const hideAlert = () => {
    setShowAlert(false)
  }

  const pickImage = async (
    mediaTypes: ImagePicker.MediaType | ImagePicker.MediaType[],
    useCamera: boolean
  ) => {
    try {
      setIsLoading(true)
      hideAlert()

      // Request permissions
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required to take photos.')
          return
        }
      }

      // Launch image picker
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes,
            // allowsEditing: true,
            // aspect: [1, 1], // Square aspect ratio
            quality: 0.8,
            cameraType: ImagePicker.CameraType.front,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes,
            // allowsEditing: true,
            // aspect: [1, 1], // Square aspect ratio
            quality: 0.8,
            selectionLimit: 1,
          })

      if (!result.canceled && result.assets[0]) {
        console.log('Image selected:', result.assets[0])
        await processSelectedImage(result.assets[0])
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Error', 'Failed to select image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const processSelectedImage = async (asset: ImagePicker.ImagePickerAsset) => {
    try {
      // Generate unique ID and timestamp
      const timestamp = Date.now()

      // Create temporary selfie object with camera/gallery URI
      const tempSelfie: Selfie = {
        id: `user_${timestamp}`,
        name: 'My Photo',
        description: 'User captured photo',
        imageUrl: asset.uri, // Pass local device URI to utility
        tags: ['user-photo'],
        createdAt: new Date().toISOString(),
      }

      onPhotoSelected(tempSelfie)
    } catch (error) {
      console.error('❌ Error processing camera/gallery image:', error)
      Alert.alert('Error', 'Failed to save image. Please try again.')
    }
  }

  const handleCameraPress = () => {
    pickImage('images', true)
  }

  const handleGalleryPress = () => {
    pickImage('images', false)
  }

  return {
    isLoading,
    showAlert,
    showImagePicker,
    hideAlert,
    handleCameraPress,
    handleGalleryPress,
  }
}
