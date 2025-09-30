import { View, Text } from 'react-native'

import { useStore } from 'zustand'

import ParticleCanvas from './ParticleCanvas'

import { usePoseStore } from '@/stores'
import { usePixelatedEffect } from '../hooks/usePixelatedEffect'

export default function PixelatedEffect() {
  const selectedPose = useStore(usePoseStore, (state) => state.selectedPose)
  const { image } = usePixelatedEffect()

  if (!selectedPose) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg text-textSecondary">No pose selected</Text>
      </View>
    )
  }

  if (!image) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg text-textSecondary">Loading image...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <ParticleCanvas />
    </View>
  )
}
