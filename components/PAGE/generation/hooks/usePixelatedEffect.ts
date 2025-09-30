import { useMemo, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'

import { useImage } from '@shopify/react-native-skia'
import { Gesture } from 'react-native-gesture-handler'
import { makeMutable } from 'react-native-reanimated'
import { useStore } from 'zustand'

import { usePoseStore } from '@/stores'

import { IParticle } from '../types/types'
import { getDefaultParticleConfig } from './utils/imageProcessor'
import { makeImageParticles } from './utils/particleUtils'

export function usePixelatedEffect() {
  const { width: stageWidth, height: stageHeight } = useWindowDimensions()
  const selectedPose = useStore(usePoseStore, (state) => state.selectedPose)

  const image = useImage(selectedPose?.imageUrl)

  const particlesShared = makeMutable<IParticle[]>([])

  const config = useMemo(
    () => getDefaultParticleConfig(stageWidth, stageHeight),
    [stageWidth, stageHeight]
  )

  const particles = useMemo(() => {
    if (!image || !stageWidth || !stageHeight) return []

    const newParticles = makeImageParticles(image, config)
    return newParticles
  }, [image, config, stageWidth, stageHeight])

  useEffect(() => {
    particlesShared.value = particles
  }, [particles, particlesShared])

  const gesture = Gesture.Pan().onChange((event) => {
    'worklet'
    console.log('Pan gesture event:', event)
    const currentParticles = particlesShared.value

    for (let i = 0; i < currentParticles.length; i++) {
      const particle = currentParticles[i]
      const dx = event.x - particle.x
      const dy = event.y - particle.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const minDist = config.minPushDistance

      if (dist < minDist) {
        const angle = Math.atan2(dy, dx)
        const tx = particle.x + Math.cos(angle) * minDist
        const ty = particle.y + Math.sin(angle) * minDist
        const ax = tx - event.x
        const ay = ty - event.y
        particle.vx -= ax
        particle.vy -= ay
      }
    }
  })

  return {
    image,
    particles,
    particlesShared,
    config,
    gesture,
    stageWidth,
    stageHeight,
    selectedPose,
  }
}
