// 1. React Native Core & Expo
import { View, Text, ScrollView } from 'react-native'
// components
import PhotoCardGrid from './Top/PhotoCardGrid'
// ui
import CustomImage from '@/components/ui/CustomImage/CustomImage'

// assets
import { appAssets } from '@/shared/assets/assets'

interface TopProps {}

export function Top({}: TopProps) {
  return (
    <View className="px-2 pb-8 pt-8">
      <Text className="mb-6 px-4 text-center text-3xl font-bold text-textPrimary">
        Let&apos;s create something new!
      </Text>

      {/* CustomImage Gallery Demo */}
      <View className="mb-8 px-4">
        <Text className="mb-4 text-center text-lg font-semibold text-textPrimary">
          Sample Gallery
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerStyle={{ paddingHorizontal: 8 }}
        >
          <View className="flex-row space-x-4">
            <CustomImage
              source={appAssets.poses.dress}
              width={120}
              height={160}
              borderRadius={12}
              containerStyle={{ marginRight: 8 }}
            />
            <CustomImage
              source={appAssets.poses.fromTop}
              width={120}
              height={160}
              borderRadius={12}
              containerStyle={{ marginRight: 8 }}
            />
            <CustomImage
              source={appAssets.gallery.img}
              width={120}
              height={160}
              borderRadius={12}
              containerStyle={{ marginRight: 8 }}
            />
            <CustomImage
              source={appAssets.icon}
              width={80}
              height={80}
              borderRadius={40}
              containerStyle={{ marginRight: 8, alignSelf: 'center' }}
            />
          </View>
        </ScrollView>
      </View>

      <PhotoCardGrid />
    </View>
  )
}
