import { View, Text, TouchableOpacity, Modal } from 'react-native'
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutUp } from 'react-native-reanimated'

import { brandColors } from '@/shared/theme/colors'

interface AlertProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Alert({ visible, onClose, title, children }: AlertProps) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={onClose}>
      <Animated.View
        className="flex-1 items-center justify-center  px-6"
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        <TouchableOpacity className="absolute inset-0" activeOpacity={1} onPress={onClose} />

        <Animated.View
          entering={SlideInUp.duration(350).springify()}
          exiting={SlideOutUp.duration(200)}
          className="w-full max-w-sm overflow-hidden rounded-2xl bg-background">
          {title && (
            <View
              className="bg-card px-6 py-4"
              style={{
                borderBottomWidth: 2,
                borderBottomColor: brandColors.border,
              }}>
              <Text
                className="text-center text-xl font-semibold"
                // style={{ color: brandColors.textLight }}
              >
                {title}
              </Text>
            </View>
          )}

          <View className="p-6">{children}</View>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}
