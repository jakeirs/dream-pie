import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Icon, ICON_FAMILY_NAME } from '@/components/ui/icons'
import { brandColors } from '@/shared/theme'

interface PageHeaderProps {
  title: string | React.ReactNode
  rightIcon?: {
    name: string
    family: ICON_FAMILY_NAME
    onPress: () => void
    color?: string
  }
  leftIcon?: {
    name: string
    family: ICON_FAMILY_NAME
    onPress: () => void
    color?: string
  }
  backgroundColor?: string
  titleColor?: string
  iconColor?: string
  borderColor?: string
}

export function PageHeader({
  title,
  rightIcon,
  leftIcon,
  backgroundColor = brandColors.background,
  titleColor = brandColors.textPrimary,
  iconColor = brandColors.textPrimary,
  borderColor = brandColors.borderLight,
}: PageHeaderProps) {
  const router = useRouter()

  return (
    <View
      className="flex-row items-center justify-between border-b-[0.5px] px-4 py-3"
      style={{
        backgroundColor,
        borderBottomColor: borderColor,
      }}>
      <View className="h-10 w-10 items-center justify-center">
        {leftIcon ? (
          <TouchableOpacity onPress={leftIcon.onPress} accessibilityRole="button" accessibilityLabel="Back">
            <Icon
              family={leftIcon.family}
              name={leftIcon.name}
              size={20}
              color={leftIcon.color ?? iconColor}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
            <Icon
              family={ICON_FAMILY_NAME.FontAwesome5}
              name="arrow-left"
              size={20}
              color={iconColor}
            />
          </TouchableOpacity>
        )}
      </View>

      <View className="mx-4 flex-1 items-center">
        {typeof title === 'string' ? (
          <Text className="text-xl font-semibold" style={{ color: titleColor }}>
            {title}
          </Text>
        ) : (
          title
        )}
      </View>

      <View className="h-10 w-10 items-center justify-center">
        {rightIcon && (
          <TouchableOpacity onPress={rightIcon.onPress} accessibilityRole="button" accessibilityLabel={rightIcon.name}>
            <Icon
              family={rightIcon.family}
              name={rightIcon.name}
              size={20}
              color={rightIcon.color ?? iconColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
