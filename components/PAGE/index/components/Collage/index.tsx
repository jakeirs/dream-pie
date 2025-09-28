import { View } from 'react-native'

import Button from '@/components/ui/Button/Button'
import { CollageCanvas } from './CollageCanvas'
import CollagePreview from './CollagePreview'
import { useStore } from 'zustand'
import { usePoseStore, useSelfieChooserStore } from '@/stores'

export default function CollageGenerator() {
  const selectedPose = useStore(usePoseStore, (state) => state.selectedPose)
  const selectedSelfie = useStore(useSelfieChooserStore, (state) => state.selectedSelfie)

  if (!selectedPose || !selectedSelfie) {
    return null
  }

  console.log('Rendering CollageGenerator with selectedPose and selectedSelfie')
  return (
    <View className="flex-1 space-y-6 p-4">
      <CollageCanvas />

      <CollagePreview />
    </View>
  )
}
