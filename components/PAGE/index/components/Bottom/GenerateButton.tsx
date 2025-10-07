import { View } from 'react-native'
import { router } from 'expo-router'

import Button from '@/components/ui/Button/Button'
import { useStore , usePoseStore, useSelfieChooserStore, usePhotoGenerationStore } from '@/stores'

import { ICON_FAMILY_NAME } from '@/components/ui/icons'

interface GenerateButtonProps {
  className?: string
}

export default function GenerateButton({ className = '' }: GenerateButtonProps) {
  const selectedPose = useStore(usePoseStore, (state) => state.selectedPose)
  const selectedSelfie = useStore(useSelfieChooserStore, (state) => state.selectedSelfie)
  const photoGeneration = usePhotoGenerationStore()

  const canGenerate = Boolean(selectedSelfie && selectedPose && !photoGeneration.isProcessing)

  const handleGeneratePhoto = () => {
    if (!selectedSelfie) {
      return
    }
    if (!selectedPose) {
      return
    }

    photoGeneration.reset()
    photoGeneration.startGeneration(selectedPose, selectedSelfie)

    router.push('/generation')
  }

  return (
    <View className={`mb-8 px-6 ${className}`}>
      <Button
        title="🎨 Generate Photo"
        onPress={handleGeneratePhoto}
        disabled={!canGenerate}
        className="w-full"
        variant="primaryForeground"
        size="lg"
        icon={{
          family: ICON_FAMILY_NAME.SimpleLineIcons,
          name: 'magic-wand',
          position: 'left',
        }}
      />
    </View>
  )
}
