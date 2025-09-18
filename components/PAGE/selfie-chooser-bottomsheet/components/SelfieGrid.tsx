// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text } from 'react-native'
import { useEffect } from 'react'

// 2. UI components (@/components/ui)
import SelfieCard from '@/components/ui/SelfieCard/SelfieCard'

// 3. Constants, Types, Mock Data
import { useSelfieChooserStore } from '@/stores'
import { mockSelfies } from '@/mockData/dream/selfies'

export const SelfieGrid = () => {
  const { setSelectedSelfie, selectedSelfie, selfies, setSelfies } = useSelfieChooserStore()

  // Load selfies on mount if empty
  useEffect(() => {
    if (selfies.length === 0) {
      setSelfies(mockSelfies)
    }
  }, [selfies.length, setSelfies])

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

  return (
    <View className="flex-row flex-wrap p-1">
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