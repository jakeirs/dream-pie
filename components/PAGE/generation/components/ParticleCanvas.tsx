import { View, Text } from 'react-native'

import { Canvas } from '@shopify/react-native-skia'
import { GestureDetector } from 'react-native-gesture-handler'
import { SharedValue, useFrameCallback } from 'react-native-reanimated'

import ParticleRenderer from './ParticleRenderer'

import { usePixelatedEffect } from '../hooks/usePixelatedEffect'

interface ParticleCanvasProps {
  bubbleX: SharedValue<number>
  bubbleY: SharedValue<number>
  bubbleWidth: number
  bubbleHeight: number
  repulsionPadding: number
  repulsionStrength: SharedValue<number>
  isBubbleVisible: boolean
}

export default function ParticleCanvas({
  bubbleX,
  bubbleY,
  bubbleWidth,
  bubbleHeight,
  repulsionPadding,
  repulsionStrength,
  isBubbleVisible,
}: ParticleCanvasProps) {
  const { image, particles, particlesShared, config, gesture, stageWidth, stageHeight } =
    usePixelatedEffect()

  // Update particle physics on every frame
  useFrameCallback(() => {
    'worklet'

    particlesShared.modify((particles) => {
      'worklet'

      // Get current animated repulsion strength (0 to 1)
      const strength = repulsionStrength.value

      const bubbleCenterX = bubbleX.value + bubbleWidth / 2
      const bubbleCenterY = bubbleY.value + bubbleHeight / 2

      // Ellipse radii with padding
      const radiusX = bubbleWidth / 2 + repulsionPadding
      const radiusY = bubbleHeight / 2 + repulsionPadding

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        // Ellipse collision detection with smooth force falloff
        if (isBubbleVisible && strength > 0.01) {
          const dx = particle.x - bubbleCenterX
          const dy = particle.y - bubbleCenterY

          // Ellipse distance formula
          const normalizedDist = Math.sqrt(
            (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY)
          )

          // Check if particle is inside ellipse
          if (normalizedDist < 1.0) {
            // Smooth force falloff: stronger near center, weaker at edges
            const distanceFactor = 1.0 - normalizedDist
            const falloffCurve = distanceFactor * distanceFactor

            // Normalize direction
            const dist = Math.sqrt(dx * dx + dy * dy)
            const dirX = dist > 0 ? dx / dist : 1
            const dirY = dist > 0 ? dy / dist : 0

            // Apply force with smooth falloff
            const baseForce = strength * 10.0
            const force = baseForce * falloffCurve
            particle.vx += dirX * force
            particle.vy += dirY * force
          }
        }

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
