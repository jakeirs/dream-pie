import { SkImage } from '@shopify/react-native-skia'

import { ParticleConfig } from '../../types/types'

export const calculateImageDimensions = (
  image: SkImage | null,
  stageWidth: number,
  stageHeight: number
): { width: number; height: number } => {
  if (!image) {
    return { width: stageWidth, height: stageHeight }
  }

  const imageWidth = image.width()
  const imageHeight = image.height()
  const imageAspectRatio = imageWidth / imageHeight
  const stageAspectRatio = stageWidth / stageHeight

  let finalWidth = stageWidth
  let finalHeight = stageHeight

  if (imageAspectRatio > stageAspectRatio) {
    finalHeight = stageWidth / imageAspectRatio
  } else {
    finalWidth = stageHeight * imageAspectRatio
  }

  return { width: finalWidth, height: finalHeight }
}

export const getDefaultParticleConfig = (
  stageWidth: number,
  stageHeight: number
): ParticleConfig => ({
  density: 35,
  particleSize: 15,
  friction: 0.88,
  moveSpeed: 0.88,
  minPushDistance: 100,
  stageWidth,
  stageHeight,
})