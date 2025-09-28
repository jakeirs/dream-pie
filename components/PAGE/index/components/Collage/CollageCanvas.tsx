/**
 * COLLAGE CANVAS COMPONENT
 *
 * React Native Skia Canvas component for rendering collages
 * Renders green background with centered selfie image
 */

import {
  Canvas,
  Rect,
  Image,
  useImage,
} from '@shopify/react-native-skia'
import { Selfie } from '@/types/dream/selfie'
import { getDefaultCollageConfig } from './utils/imageUtils'
import { calculateCollageImagePosition } from './utils/collageRenderer'

interface CollageCanvasProps {
  selfie: Selfie | null
  visible?: boolean
  ref?: React.RefObject<any>
}

function CollageCanvas({ selfie, visible = true, ref }: CollageCanvasProps) {
    const config = getDefaultCollageConfig()

    // Load the selfie image using Skia's useImage hook
    const image = useImage(selfie?.imageUrl || null)

    // Calculate image position if image is loaded
    const imagePosition = image
      ? calculateCollageImagePosition(image, config)
      : null

    if (!visible) return null

    return (
      <Canvas
        ref={ref}
        style={{
          width: config.canvasWidth,
          height: config.canvasHeight,
        }}
      >
        {/* Green Background */}
        <Rect
          x={0}
          y={0}
          width={config.canvasWidth}
          height={config.canvasHeight}
          color={config.backgroundColorHex}
        />

        {/* Centered Selfie Image */}
        {image && imagePosition && (
          <Image
            image={image}
            x={imagePosition.x}
            y={imagePosition.y}
            width={imagePosition.width}
            height={imagePosition.height}
            fit="contain"
          />
        )}
      </Canvas>
    )
}

export default CollageCanvas