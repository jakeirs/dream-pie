import { View, Text } from 'react-native'

import { Canvas } from '@shopify/react-native-skia'
import { GestureDetector } from 'react-native-gesture-handler'
import { useFrameCallback } from 'react-native-reanimated'

import ParticleRenderer from './ParticleRenderer'

import { usePixelatedEffect } from '../hooks/usePixelatedEffect'

export default function ParticleCanvas() {
  const { image, particles, particlesShared, config, gesture, stageWidth, stageHeight } =
    usePixelatedEffect()

  // Update particle physics on every frame
  useFrameCallback(() => {
    'worklet'

    particlesShared.modify((particles) => {
      'worklet'

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        // Spring back to saved position
        particle.x += (particle.savedX - particle.x) * config.moveSpeed
        particle.y += (particle.savedY - particle.y) * config.moveSpeed

        // Apply friction and velocity
        particle.vx *= config.friction
        particle.vy *= config.friction

        particle.x += particle.vx
        particle.y += particle.vy
      }

      return particles
    })
  })

  if (!particles.length || !image) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 50 }}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Canvas
          style={{ flex: 1, backgroundColor: '#000000', width: stageWidth, height: stageHeight }}>
          <ParticleRenderer image={image} particlesShared={particlesShared} config={config} />
        </Canvas>
      </GestureDetector>
    </View>
  )
}
