import { View, Text } from 'react-native'
import { useStore } from 'zustand'

import PixelatedEffect from './components/PixelatedEffect'
import TransitionContainer from './components/TransitionContainer'
import ResultView from './components/ResultView'

import { useInformationAnimation } from './hooks/useInformationAnimation'
import { useViewResultTransition } from './hooks/useViewResultTransition'
import { INFORMATION_CONFIG } from './config/informationConfig'

import Button from '@/components/ui/Button/Button'
import InformationBubble from '@/components/ui/InformationBubble/InformationBubble'
import { usePoseStore } from '@/stores'
import { brandColors } from '@/shared/theme'

export default function GenerationPage() {
  const selectedPose = useStore(usePoseStore, (state) => state.selectedPose)

  const {
    transitionState,
    scale,
    opacity,
    resultScale,
    startTransition,
    isFullScreen,
    showResultView,
  } = useViewResultTransition()

  const handleNext = () => {
    startTransition()
  }

  const {
    currentMessage,
    isVisible,
    x,
    y,
    bubbleWidth,
    bubbleHeight,
    repulsionPadding,
    repulsionStrength,
  } = useInformationAnimation(isFullScreen)

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1">
        {showResultView && <ResultView selectedPose={selectedPose} scale={resultScale} />}

        {transitionState !== 'hiddenParticles' && (
          <TransitionContainer scale={scale} opacity={opacity} transitionState={transitionState}>
            <PixelatedEffect
              bubbleX={x}
              bubbleY={y}
              bubbleWidth={bubbleWidth}
              bubbleHeight={bubbleHeight}
              repulsionPadding={repulsionPadding}
              repulsionStrength={repulsionStrength}
              isBubbleVisible={isVisible}
            />
          </TransitionContainer>
        )}

        {isFullScreen && (
          <InformationBubble
            message={currentMessage}
            visible={isVisible}
            x={x}
            y={y}
            fadeInDuration={INFORMATION_CONFIG.FADE_IN_DURATION}
            fadeOutDuration={INFORMATION_CONFIG.FADE_OUT_DURATION}
          />
        )}
      </View>

      {isFullScreen && (
        <View className="absolute bottom-8 left-0 right-0 px-6">
          <Button
            onPress={handleNext}
            className="w-full"
            style={{
              backgroundColor: brandColors.primary,
              paddingVertical: 24,
            }}>
            <Text className="text-xl font-bold" style={{ color: brandColors.primaryForeground }}>
              View Result →
            </Text>
          </Button>
        </View>
      )}
    </View>
  )
}
