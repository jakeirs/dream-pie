// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text } from 'react-native'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

// 2. UI components (@/components/ui)
import SelfieCard from '@/components/ui/SelfieCard/SelfieCard'
import CameraButton from '@/components/ui/CameraButton/CameraButton'

// 3. Constants, Types, Mock Data
import { useSelfieChooserStore } from '@/stores'
import { mockSelfies } from '@/mockData/dream/selfies'
import { Selfie } from '@/types/dream/selfie'

export const SelfieGrid = () => {
  const { setSelectedSelfie, selectedSelfie, selfies, setSelfies } = useSelfieChooserStore()

  // Load selfies on mount if empty
  useEffect(() => {
    loadSelfies()
  }, [setSelfies])

  const loadSelfies = async () => {
    try {
      // Load user-captured selfies from AsyncStorage
      const userSelfiesJson = await AsyncStorage.getItem('user_selfies')
      const userSelfies: Selfie[] = userSelfiesJson ? JSON.parse(userSelfiesJson) : []

      // Combine user selfies with mock selfies
      const allSelfies = [...userSelfies, ...mockSelfies]
      setSelfies(allSelfies)
    } catch (error) {
      console.error('Error loading selfies:', error)
      // Fallback to mock data only
      setSelfies(mockSelfies)
    }
  }

  // Safety check for selfies array
  if (!selfies || selfies.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center text-textSecondary">Loading selfies...</Text>
      </View>
    )
  }
  const handleSelfieSelect = (selfieId: string) => {
    const selfie = selfies.find((s) => s.id === selfieId)
    if (selfie) {
      setSelectedSelfie(selfie)
    }
  }

  const handlePhotoSelected = async (newSelfie: Selfie) => {
    // Add new selfie to the beginning of the list
    const updatedSelfies = [newSelfie, ...selfies]
    setSelfies(updatedSelfies)

    // Automatically select the new selfie
    setSelectedSelfie(newSelfie)
  }

  return (
    <View className="flex-row flex-wrap p-1">
      {/* Camera Button - First item */}
      <View className="w-1/3 p-1">
        <CameraButton onPhotoSelected={handlePhotoSelected} />
      </View>

      {/* Existing Selfies */}
      {selfies.map((selfie) => {
        const isSelected = selectedSelfie?.id === selfie.id

        return (
          <View key={selfie.id} className="w-1/3 p-1">
            <SelfieCard selfie={selfie} isSelected={isSelected} onSelect={handleSelfieSelect} />
          </View>
        )
      })}
    </View>
  )
}