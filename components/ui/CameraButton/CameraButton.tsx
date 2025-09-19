import { View, TouchableOpacity, Alert } from 'react-native'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Icon } from '@/components/ui/icons/Icon'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'

import { brandColors } from '@/shared/theme/colors'
import { Selfie } from '@/types/dream/selfie'

interface CameraButtonProps {
  onPhotoSelected: (selfie: Selfie) => void
}

export default function CameraButton({ onPhotoSelected }: CameraButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const showImagePicker = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add a photo',
      [
        {
          text: 'Camera',
          onPress: () => pickImage(ImagePicker.MediaTypeOptions.Images, true),
        },
        {
          text: 'Gallery',
          onPress: () => pickImage(ImagePicker.MediaTypeOptions.Images, false),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    )
  }

  const pickImage = async (mediaTypes: ImagePicker.MediaTypeOptions, useCamera: boolean) => {
    try {
      setIsLoading(true)

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
      const fileUri = `${FileSystem.documentDirectory!}${filename}`

      // Copy image to app's document directory
      await FileSystem.copyAsync({
        from: asset.uri,
        to: fileUri,
      })

      // Create new selfie object
      const newSelfie: Selfie = {
        id: `user_${timestamp}`,
        name: 'My Photo',
        description: 'User captured photo',
        imageUrl: fileUri,
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
      const existingSelfies = await AsyncStorage.getItem('user_selfies')
      const selfies = existingSelfies ? JSON.parse(existingSelfies) : []
      selfies.push(selfie)
      await AsyncStorage.setItem('user_selfies', JSON.stringify(selfies))
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error)
    }
  }

  return (
    <View className="aspect-square w-full p-1">
      <TouchableOpacity
        className="flex-1 items-center justify-center rounded-lg"
        style={{ backgroundColor: brandColors.primary }}
        onPress={showImagePicker}
        disabled={isLoading}
        activeOpacity={0.8}>
        <Icon
          family={ICON_FAMILY_NAME.Feather}
          name="camera"
          size={32}
          color={brandColors.primaryForeground}
        />
      </TouchableOpacity>
    </View>
  )
}
