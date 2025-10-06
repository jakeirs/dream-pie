import { useEffect } from 'react'
import { View } from 'react-native'
import { useStore } from 'zustand'

import TransitionContainer from './components/TransitionContainer'
import ResultView from './components/ResultView'

import { useInformationAnimation } from './components/ParticlesImage/hooks/useInformationAnimation'
import { useViewResultTransition } from './hooks/useViewResultTransition'
import { useGeneratePhotoLogic } from './hooks/useGeneratePhotoLogic'
import { INFORMATION_CONFIG } from './components/ParticlesImage/config/informationConfig'

import InformationBubble from '@/components/ui/InformationBubble/InformationBubble'
import { usePhotoGenerationStore } from '@/stores'
import CollageGenerator from './components/CollageGenerator/CollageGenerator'
import PixelatedEffect from './components/ParticlesImage/components/PixelatedEffect'

export default function GenerationPage() {
  const usedPose = useStore(usePhotoGenerationStore, (state) => state.usedPose)
  const usedSelfie = useStore(usePhotoGenerationStore, (state) => state.usedSelfie)
  const result = useStore(usePhotoGenerationStore, (state) => state.result)

  const { generatePhoto } = useGeneratePhotoLogic()

  const {
    transitionState,
    scale,
    opacity,
    resultScale,
    startTransition,
    isFullScreen,
    showResultView,
  } = useViewResultTransition()

  useEffect(() => {
    if (usedPose && usedSelfie && !result) {
      generatePhoto()
    }
  }, [usedPose, usedSelfie])

  // Auto-trigger animation when result is ready
  useEffect(() => {
    if (result && !showResultView) {
      startTransition()
    }
  }, [result, showResultView])

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
        {showResultView && <ResultView result={result} scale={resultScale} />}

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

      <CollageGenerator />
    </View>
  )
}
