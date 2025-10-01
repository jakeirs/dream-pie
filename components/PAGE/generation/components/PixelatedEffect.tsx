import { View, Text } from 'react-native'

import { SharedValue } from 'react-native-reanimated'
import { useStore } from 'zustand'

import ParticleCanvas from './ParticleCanvas'

import { usePoseStore } from '@/stores'
import { useEffect } from 'react'

interface PixelatedEffectProps {
  bubbleX: SharedValue<number>
  bubbleY: SharedValue<number>
  bubbleWidth: number
  bubbleHeight: number
  repulsionPadding: number
  repulsionStrength: SharedValue<number>
  isBubbleVisible: boolean
}

export default function PixelatedEffect({
  bubbleX,
  bubbleY,
  bubbleWidth,
  bubbleHeight,
  repulsionPadding,
  repulsionStrength,
  isBubbleVisible,
}: PixelatedEffectProps) {
  const selectedPose = useStore(usePoseStore, (state) => state.selectedPose)

  useEffect(() => {
    return () => {
      console.log('PixelatedEffect unmounted, cleanup if necessary')
    }
  }, [])

  if (!selectedPose) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg text-textSecondary">No pose selected</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <ParticleCanvas
        bubbleX={bubbleX}
        bubbleY={bubbleY}
        bubbleWidth={bubbleWidth}
        bubbleHeight={bubbleHeight}
        repulsionPadding={repulsionPadding}
        repulsionStrength={repulsionStrength}
        isBubbleVisible={isBubbleVisible}
      />
    </View>
  )
}
