import { ClipOp, Picture, SkImage, Skia, createPicture, rect } from '@shopify/react-native-skia'
import { SharedValue, useDerivedValue } from 'react-native-reanimated'

import { IParticle, ParticleConfig } from '../types/types'

interface ParticleRendererProps {
  image: SkImage
  particlesShared: SharedValue<IParticle[]>
  config: ParticleConfig
}

// Shared Paint object - create once and reuse
const sharedPaint = Skia.Paint()

// Shared clip path - create once with unit radius, scale during use
const clipPath = Skia.Path.Make()
clipPath.addCircle(0, 0, 1) // Unit circle, will be scaled

export default function ParticleRenderer({
  image,
  particlesShared,
  config,
}: ParticleRendererProps) {
  const picture = useDerivedValue(() => {
    const currentParticles = particlesShared.get()
    const { particleSize, stageWidth, stageHeight } = config

    // Pre-calculate image rectangles once per frame
    const srcRect = rect(0, 0, image.width(), image.height())
    const dstRect = rect(0, 0, stageWidth, stageHeight)

    return createPicture((canvas) => {
      currentParticles.forEach((particle) => {
        canvas.save()
        canvas.translate(particle.x, particle.y)
        canvas.scale(particleSize, particleSize) // Scale the unit circle to particle size
        canvas.clipPath(clipPath, ClipOp.Intersect, true)
        canvas.scale(1 / particleSize, 1 / particleSize) // Undo scale for image
        canvas.translate(-particle.x, -particle.y)
        canvas.drawImageRect(image, srcRect, dstRect, sharedPaint)
        canvas.restore()
      })
    })
  }, [particlesShared, image, config])

  return <Picture picture={picture} />
}
