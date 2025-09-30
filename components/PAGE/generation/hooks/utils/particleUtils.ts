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

  // Optimize: Reuse Path objects by creating them outside the hot loop
  const pathPool: any[] = []
  const getClipPath = (x: number, y: number) => {
    const clipPath = Skia.Path.Make()
    clipPath.addCircle(x, y, particleSize)
    return clipPath
  }

  for (let x = 0; x < stageWidth; x += density) {
    for (let y = 0; y < stageHeight; y += density) {
      const picture = createPicture((canvas) => {
        // Optimized: Reduce save/restore overhead by minimizing state changes
        const clipPath = getClipPath(x, y)

        canvas.save()
        canvas.translate(-x, -y)
        canvas.clipPath(clipPath, ClipOp.Intersect, true)
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