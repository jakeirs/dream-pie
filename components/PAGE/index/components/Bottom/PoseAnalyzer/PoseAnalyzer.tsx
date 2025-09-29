import { View } from 'react-native'
import { useStore } from 'zustand'

import AnalyzeButton from './components/AnalyzeButton'

import { usePoseAnalyzer } from './hooks/usePoseAnalyzer'
import { usePoseStore } from '@/stores'

export default function PoseAnalyzer() {
  const selectedPose = useStore(usePoseStore, (state) => state.selectedPose)
  const { isAnalyzing, analyzePose } = usePoseAnalyzer()

  console.log('🧩 PoseAnalyzer render:', {
    hasSelectedPose: !!selectedPose,
    poseName: selectedPose?.name,
    isAnalyzing
  })

  if (!selectedPose) {
    console.log('🚫 No selected pose, not rendering PoseAnalyzer')
    return null
  }

  return (
    <View className="flex-1 space-y-4 p-4">
      <AnalyzeButton
        onPress={analyzePose}
        isAnalyzing={isAnalyzing}
        disabled={isAnalyzing}
        selectedPose={selectedPose}
      />
    </View>
  )
}