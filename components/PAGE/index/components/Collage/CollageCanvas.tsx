import { View } from 'react-native'
import { Canvas, Rect, Image } from '@shopify/react-native-skia'

import Button from '@/components/ui/Button/Button'
import { useCollageGeneration } from './hooks/useCollageGeneration'

export function CollageCanvas() {
  const { generateCollage, canvasRef, poseImage, selfieImage, config, layout } =
    useCollageGeneration()

  if (!layout) return null

  return (
    <>
      <View className="items-center">
        <Button
          title={'Create Collage'}
          onPress={generateCollage}
          variant="primary"
          disabled={!layout}
          size="lg"
        />
      </View>
      <View
        style={{
          position: 'absolute',
          left: -9999,
          top: -9999,
          opacity: 0,
        }}>
        <Canvas
          ref={canvasRef}
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
            x={layout.posePhoto.x}
            y={layout.posePhoto.y}
            width={layout.posePhoto.width}
            height={layout.posePhoto.height}
            fit="contain"
          />
        </Canvas>
      </View>
    </>
  )
}
