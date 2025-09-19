import { View, Text, TouchableOpacity, Modal } from 'react-native'
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from 'react-native-reanimated'

import { brandColors } from '@/shared/theme/colors'

interface AlertProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Alert({ visible, onClose, title, children }: AlertProps) {
  const AnimatedView = Animated.createAnimatedComponent(View)

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={onClose}>

      <Animated.View
        className="flex-1 justify-center items-center px-6"
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>

        <TouchableOpacity
          className="absolute inset-0"
          activeOpacity={1}
          onPress={onClose}
        />

        <AnimatedView
          entering={SlideInUp.duration(300).springify()}
          exiting={SlideOutDown.duration(200)}
          className="w-full max-w-sm rounded-2xl overflow-hidden"
          style={{ backgroundColor: brandColors.card }}>

          {title && (
            <View
              className="px-6 py-4 border-b"
              style={{
                backgroundColor: brandColors.primary,
                borderBottomColor: brandColors.border
              }}>
              <Text
                className="text-xl font-semibold text-center"
                style={{ color: brandColors.primaryForeground }}>
                {title}
              </Text>
            </View>
          )}

          <View className="p-6">
            {children}
          </View>

        </AnimatedView>

      </Animated.View>

    </Modal>
  )
}