import { ClipOp, SkImage, Skia, createPicture, rect } from '@shopify/react-native-skia'

import { IParticle, ParticleConfig } from '../../types/types'

// Memoized Skia resources - create once and reuse across all particles
const sharedPaint = Skia.Paint()

export const makeImageParticles = (
  image: SkImage,
  config: ParticleConfig
): IParticle[] => {
  const result: IParticle[] = []

  const { density, particleSize, stageWidth, stageHeight } = config

  // Validate dimensions
  if (!stageWidth || !stageHeight || stageWidth <= 0 || stageHeight <= 0) {
    return result
  }

  // Pre-calculate image rectangles once instead of per particle
  const srcRect = rect(0, 0, image.width(), image.height())
  const dstRect = rect(0, 0, stageWidth, stageHeight)

  for (let x = 0; x < stageWidth; x += density) {
    for (let y = 0; y < stageHeight; y += density) {
      const picture = createPicture((canvas) => {
        canvas.save()
        canvas.translate(-x, -y)

        // Create clip path for this particle
        const clipPath = Skia.Path.Make()
        clipPath.addCircle(x, y, particleSize)
        canvas.clipPath(clipPath, ClipOp.Intersect, true)

        // Use shared paint and pre-calculated rects
        canvas.drawImageRect(image, srcRect, dstRect, sharedPaint)

        canvas.restore()
      })

      result.push({
        x: x,
        y: y,
        savedX: x,
        savedY: y,
        vx: 0,
        vy: 0,
        picture,
      })
    }
  }

  return result
}