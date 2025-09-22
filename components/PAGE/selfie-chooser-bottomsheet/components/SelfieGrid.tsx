// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View } from 'react-native'
import { useEffect } from 'react'

// 2. UI components (@/components/ui)
import SelfieCard from '@/components/ui/SelfieCard/SelfieCard'
import CameraButton from '@/components/ui/CameraButton/CameraButton'

// 3. Constants, Types, Mock Data
import { useSelfieChooserStore } from '@/stores'
import { USER_SELFIES } from '@/stores/AsyncStorage/keys'
import { loadItemsFromAsyncStorage } from '@/stores/AsyncStorage/utils'

import { Selfie } from '@/types/dream/selfie'

export const SelfieGrid = () => {
  const { setSelectedSelfie, selectedSelfie, selfies, setSelfies, addSelfieAndWait } =
    useSelfieChooserStore()

  // Load selfies on mount if empty
  useEffect(() => {
    loadSelfies()
  }, [setSelfies])

  const loadSelfies = async () => {
    // Load user-captured selfies from AsyncStorage
    const userSelfies = await loadItemsFromAsyncStorage<Selfie>(USER_SELFIES)

    if (userSelfies.length > 0) {
      setSelfies(userSelfies)
      return
    }
    setSelfies([])
  }

  const handleSelfieSelect = (selfieId: string) => {
    const selfie = selfies.find((s) => s.id === selfieId)
    if (selfie) {
      setSelectedSelfie(selfie)
    }
  }

  const handlePhotoSelected = async (newSelfie: Selfie) => {
    try {
      console.log('📸 Processing new photo selection...')

      // Wait for file processing to complete and get permanent URI
      const processedSelfie = await addSelfieAndWait(newSelfie)

      // Now update UI with stable, permanent URI
      setSelectedSelfie(processedSelfie)

      console.log('✅ Photo processing complete, UI updated with permanent URI')
    } catch (error) {
      console.error('❌ Failed to process photo:', error)
      // Could show user error message here if needed
    }
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
