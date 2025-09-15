import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon, ICON_FAMILY_NAME } from '@/components/ui/icons';
import { brandColors } from '@/shared/theme';

interface PageHeaderProps {
  title: string | React.ReactNode;
  rightIcon?: {
    name: string;
    family: ICON_FAMILY_NAME;
    onPress: () => void;
    color?: string;
  };
  backgroundColor?: string;
  titleColor?: string;
  iconColor?: string;
  borderColor?: string;
}

export function PageHeader({
  title,
  rightIcon,
  backgroundColor = brandColors.background,
  titleColor = brandColors.textPrimary,
  iconColor = brandColors.textPrimary,
  borderColor = brandColors.borderLight
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <View
      className="flex-row justify-between items-center px-4 py-3 border-b-[0.5px]"
      style={{
        backgroundColor,
        borderBottomColor: borderColor
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 justify-center items-center"
      >
        <Icon
          family={ICON_FAMILY_NAME.FontAwesome5}
          name="arrow-left"
          size={20}
          color={iconColor}
        />
      </TouchableOpacity>

      <View className="flex-1 items-center mx-4">
        {typeof title === 'string' ? (
          <Text
            className="text-xl font-semibold"
            style={{ color: titleColor }}
          >
            {title}
          </Text>
        ) : (
          title
        )}
      </View>

      <View className="w-10 h-10 justify-center items-center">
        {rightIcon && (
          <TouchableOpacity onPress={rightIcon.onPress}>
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
  );
}