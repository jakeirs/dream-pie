import { View } from 'react-native'
import { useStore } from 'zustand'

import { CollageCanvas } from './components/CollageCanvas'
import CollagePreview from './components/CollagePreview'

import { usePoseStore, useSelfieChooserStore } from '@/stores'

export default function CollageGenerator() {
  const selectedPose = useStore(usePoseStore, (state) => state.selectedPose)
  const selectedSelfie = useStore(useSelfieChooserStore, (state) => state.selectedSelfie)

  if (!selectedPose || !selectedSelfie) {
    return null
  }

  return (
    <View className="">
      <CollageCanvas />

      {/* <CollagePreview /> */}
    </View>
  )
}
