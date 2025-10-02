import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'

import { Canvas, Skia, createPicture, Picture, SkPoint } from '@shopify/react-native-skia'
import {
  useSharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
} from 'react-native-reanimated'

const CIRCLE_RADIUS = 3
const CIRCLE_SPEED = 0.15

export default function ResultPage() {
  const size = useSharedValue({ width: 0, height: 0 })
  const circles = useSharedValue<{ x: number; y: number }[]>([])

  useAnimatedReaction(
    () => size.value,
    (currentSize) => {
      'worklet'
      const getRandomNumber = (min: number, max: number) => {
        'worklet'
        return Math.random() * (max - min) + min
      }

      circles.value = Array.from({ length: 1000 }).map(
        (): SkPoint => ({
          x: getRandomNumber(CIRCLE_RADIUS, currentSize.width - CIRCLE_RADIUS),
          y: getRandomNumber(CIRCLE_RADIUS, currentSize.height - CIRCLE_RADIUS),
        })
      )
    }
  )

  useFrameCallback((info) => {
    'worklet'
    if (!info.timeSincePreviousFrame) return
    const timeSincePreviousFrame = info.timeSincePreviousFrame

    const getRandomNumber = (min: number, max: number) => {
      'worklet'
      return Math.random() * (max - min) + min
    }

    circles.modify((circles) => {
      'worklet'
      circles.forEach((circle) => {
        circle.y += CIRCLE_SPEED * timeSincePreviousFrame

        if (circle.y > size.value.height - CIRCLE_RADIUS) {
          circle.y = -CIRCLE_RADIUS
          circle.x = getRandomNumber(CIRCLE_RADIUS, size.value.width - CIRCLE_RADIUS)
        }
      })
      return circles
    })
  })

  const picture = useDerivedValue(() => {
    'worklet'
    return createPicture((canvas) => {
      const paint = Skia.Paint()
      paint.setColor(Skia.Color('white'))

      circles.value.forEach((circle) => {
        canvas.drawCircle(circle.x, circle.y, CIRCLE_RADIUS, paint)
      })
    })
  }, [])

  const handleBackToCreate = () => {
    router.replace('/(tabs)')
  }

  return (
    <View className="flex-1 bg-black">
      <Canvas onSize={size} style={styles.canvas}>
        <Picture picture={picture} />
      </Canvas>
    </View>
  )
}

const styles = StyleSheet.create({
  canvas: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
})
