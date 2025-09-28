/**
 * COLLAGE CANVAS COMPONENT
 *
 * React Native Skia Canvas component for rendering collages
 * Renders green background with centered selfie image
 */

import { Canvas, Rect, Image, useImage } from '@shopify/react-native-skia'
import { Selfie } from '@/types/dream/selfie'
import { Pose } from '@/types/dream/pose'
import { CollageConfig } from './types'
import { getDefaultCollageConfig, getDualImageCollageConfig } from './utils/imageUtils'
import { calculateCollageImagePosition, calculateDualImageLayout } from './utils/collageRenderer'
import { View } from 'react-native'
import { useStore } from 'zustand'
import { usePoseStore, useSelfieChooserStore } from '@/stores'

interface CollageCanvasProps {
  visible?: boolean
  ref?: React.RefObject<any>
  config?: CollageConfig
}

function CollageCanvas({ ref, config: providedConfig }: CollageCanvasProps) {
  const selectedPose = useStore(usePoseStore, (state) => state.selectedPose)
  const selectedSelfie = useStore(useSelfieChooserStore, (state) => state.selectedSelfie)

  const selfieImage = useImage(selectedSelfie?.imageUrl)
  const poseImage = useImage(selectedPose?.imageUrl)

  let config = providedConfig

  if (!providedConfig && poseImage) {
    config = getDualImageCollageConfig(poseImage.width(), poseImage.height())
  } else {
    config = config || getDefaultCollageConfig()
  }

  // Calculate layout positions
  let layout = null

  if (selfieImage && poseImage && config) {
    layout = calculateDualImageLayout(selfieImage, poseImage, config)
  }

  if (!layout) return null

  return (
    <View
      style={{
        position: 'absolute',
        left: -9999,
        top: -9999,
        opacity: 0,
      }}>
      <Canvas
        ref={ref}
        style={{
          width: config.canvasWidth,
          height: config.canvasHeight,
        }}>
        {/* Conditional Background - only render if not transparent */}
        {config.backgroundMode === 'solid' && (
          <Rect
            x={0}
            y={0}
            width={config.canvasWidth}
            height={config.canvasHeight}
            color={config.backgroundColorHex}
          />
        )}

        <Image
          image={selfieImage}
          x={layout.selfiePhoto.x}
          y={layout.selfiePhoto.y}
          width={layout.selfiePhoto.width}
          height={layout.selfiePhoto.height}
          fit="contain"
        />
        <Image
          image={poseImage}
          x={layout.referencePhoto.x}
          y={layout.referencePhoto.y}
          width={layout.referencePhoto.width}
          height={layout.referencePhoto.height}
          fit="contain"
        />
      </Canvas>
    </View>
  )
}

export default CollageCanvas
