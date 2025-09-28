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

interface CollageCanvasProps {
  selfie: Selfie | null
  referencePhoto: Pose | null
  visible?: boolean
  ref?: React.RefObject<any>
  config?: CollageConfig
}

function CollageCanvas({
  selfie,
  referencePhoto,
  visible = true,
  ref,
  config: providedConfig,
}: CollageCanvasProps) {
  // Load both images using Skia's useImage hook
  const selfieImage = useImage(selfie?.imageUrl || null)
  const referenceImage = useImage(referencePhoto?.imageUrl || null)

  // Determine if we have both images for dual layout
  const isDualImageMode = selfieImage && referenceImage

  console.log('CollageCanvas - Selfie Image:', !!isDualImageMode)

  // Dynamic config based on reference photo dimensions for dual-image mode
  let config = providedConfig

  if (isDualImageMode && !providedConfig && referenceImage) {
    config = getDualImageCollageConfig(referenceImage.width(), referenceImage.height())
  } else {
    config = config || getDefaultCollageConfig()
  }

  // Calculate layout positions
  let layout = null

  if (isDualImageMode) {
    layout = calculateDualImageLayout(selfieImage, referenceImage, config)
  }

  if (!visible) return null

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

        {/* Dual Image Layout */}
        {isDualImageMode && layout && (
          <>
            {/* Selfie Photo - Top Left */}
            <Image
              image={selfieImage}
              x={layout.selfiePhoto.x}
              y={layout.selfiePhoto.y}
              width={layout.selfiePhoto.width}
              height={layout.selfiePhoto.height}
              fit="contain"
            />

            {/* Reference Photo - Top Right, 70% size */}
            <Image
              image={referenceImage}
              x={layout.referencePhoto.x}
              y={layout.referencePhoto.y}
              width={layout.referencePhoto.width}
              height={layout.referencePhoto.height}
              fit="contain"
            />
          </>
        )}
      </Canvas>
    </View>
  )
}

export default CollageCanvas
