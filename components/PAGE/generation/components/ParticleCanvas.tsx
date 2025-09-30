import { createElement, useMemo } from 'react'
import { View } from 'react-native'

import { Canvas, Group, Picture } from '@shopify/react-native-skia'
import { GestureDetector } from 'react-native-gesture-handler'
import { useFrameCallback, useSharedValue } from 'react-native-reanimated'

import { usePixelatedEffect } from '../hooks/usePixelatedEffect'

export default function ParticleCanvas() {
  const { particles, particlesRef, config, gesture, stageWidth, stageHeight } =
    usePixelatedEffect()

  const frameCount = useSharedValue(0)

  // Update particle physics on every frame
  useFrameCallback(() => {
    'worklet'
    const currentParticles = particlesRef.current

    for (let i = 0; i < currentParticles.length; i++) {
      const particle = currentParticles[i]

      // Spring back to saved position
      particle.x += (particle.savedX - particle.x) * config.moveSpeed
      particle.y += (particle.savedY - particle.y) * config.moveSpeed

      // Apply friction and velocity
      particle.vx *= config.friction
      particle.vy *= config.friction

      particle.x += particle.vx
      particle.y += particle.vy
    }

    frameCount.value++
  })

  // Render particles using Picture components
  const particleElements = useMemo(() => {
    return particles.map((particle, index) =>
      createElement(
        Group,
        {
          key: index,
          transform: [{ translateX: particle.x }, { translateY: particle.y }],
        },
        createElement(Picture, { picture: particle.picture })
      )
    )
  }, [particles])

  if (!particles.length) {
    return null
  }

  // Use createElement to bypass NativeWind's JSX wrapper for Skia components
  const skiaCanvas = createElement(
    Canvas,
    {
      style: {
        width: stageWidth,
        height: stageHeight,
        backgroundColor: '#000000',
      },
    },
    particleElements
  )

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <View style={{ width: stageWidth, height: stageHeight }}>{skiaCanvas}</View>
      </GestureDetector>
    </View>
  )
}