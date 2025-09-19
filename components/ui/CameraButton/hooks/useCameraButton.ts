import { useState } from 'react'
import { Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { File, Paths } from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { USER_SELFIES } from '@/stores/AsyncStorage/keys'
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

  const pickImage = async (mediaTypes: ImagePicker.MediaTypeOptions, useCamera: boolean) => {
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
            allowsEditing: true,
            aspect: [1, 1], // Square aspect ratio
            quality: 0.8,
            cameraType: ImagePicker.CameraType.front,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes,
            allowsEditing: true,
            aspect: [1, 1], // Square aspect ratio
            quality: 0.8,
            selectionLimit: 1,
          })

      if (!result.canceled && result.assets[0]) {
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
      // Generate unique filename
      const timestamp = Date.now()
      const filename = `selfie_${timestamp}.jpg`

      // Create source file from asset URI
      const sourceFile = new File(asset.uri)

      // Create destination file in document directory
      const destinationFile = new File(Paths.document, filename)

      // Copy image to app's document directory using new API
      await sourceFile.copy(destinationFile)

      // Create new selfie object
      const newSelfie: Selfie = {
        id: `user_${timestamp}`,
        name: 'My Photo',
        description: 'User captured photo',
        imageUrl: destinationFile.uri,
        tags: ['user-photo'],
        createdAt: new Date().toISOString(),
      }

      // Save to AsyncStorage for persistence
      await saveToAsyncStorage(newSelfie)

      // Notify parent component
      onPhotoSelected(newSelfie)
    } catch (error) {
      console.error('Error processing image:', error)
      Alert.alert('Error', 'Failed to save image. Please try again.')
    }
  }

  const saveToAsyncStorage = async (selfie: Selfie) => {
    try {
      const existingSelfies = await AsyncStorage.getItem(USER_SELFIES)
      const selfies = existingSelfies ? JSON.parse(existingSelfies) : []
      selfies.push(selfie)
      await AsyncStorage.setItem(USER_SELFIES, JSON.stringify(selfies))
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error)
    }
  }

  const handleCameraPress = () => {
    pickImage(ImagePicker.MediaTypeOptions.Images, true)
  }

  const handleGalleryPress = () => {
    pickImage(ImagePicker.MediaTypeOptions.Images, false)
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