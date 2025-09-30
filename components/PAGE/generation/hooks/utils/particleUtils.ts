import { ClipOp, SkImage, Skia, createPicture, rect } from '@shopify/react-native-skia'

import { IParticle, ParticleConfig } from '../../types/types'

export const makeImageParticles = (
  image: SkImage,
  config: ParticleConfig
): IParticle[] => {
  const result: IParticle[] = []
  const paint = Skia.Paint()

  const { density, particleSize, stageWidth, stageHeight } = config

  // Validate dimensions
  if (!stageWidth || !stageHeight || stageWidth <= 0 || stageHeight <= 0) {
    return result
  }

  for (let x = 0; x < stageWidth; x += density) {
    for (let y = 0; y < stageHeight; y += density) {
      const picture = createPicture((canvas) => {
        canvas.save()
        canvas.translate(-x, -y)

        const clipPath = Skia.Path.Make()
        clipPath.addCircle(x, y, particleSize)
        canvas.clipPath(clipPath, ClipOp.Intersect, true)

        canvas.drawImageRect(
          image,
          rect(0, 0, image.width(), image.height()),
          rect(0, 0, stageWidth, stageHeight),
          paint
        )

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