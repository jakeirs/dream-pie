import { View, Text } from 'react-native'
import { format } from 'date-fns'
import Animated from 'react-native-reanimated'

import PhotoThumbnail from '@/components/ui/PhotoThumbnail/PhotoThumbnail'
import Button from '@/components/ui/Button/Button'

import { Creation } from '@/types'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'

interface CreationContentProps {
  item: Creation
  thumbnailAnimatedStyle: any
  onShare: (imageUri: string, title: string) => void
}

export default function CreationContent({
  item,
  thumbnailAnimatedStyle,
  onShare,
}: CreationContentProps) {
  // Format date: "1 May 2025"
  const formattedDate = format(new Date(item.generatedAt), 'd MMM yyyy')
  const title = `${item.usedPose.name} Creation`

  return (
    <>
      {/* Photo Thumbnails Container - Overlapping the zoomable photo */}
      <View className="flex-row items-end px-4" style={{ marginTop: -40 }}>
        <Text className="mt-2 text-lg font-medium leading-tight text-textPrimary">
          Used{'\n'}photos:
        </Text>
        <Animated.View
          className="w-full max-w-80 flex-row justify-center gap-3 px-4"
          style={[
            {
              zIndex: 20,
            },
            thumbnailAnimatedStyle,
          ]}>
          <View style={{ flex: 1, maxWidth: 180 }}>
            <PhotoThumbnail imageUri={item.usedSelfie.imageUrl} />
          </View>
          <View style={{ flex: 1, maxWidth: 180 }}>
            <PhotoThumbnail imageUri={item.usedPose.imageUrl} />
          </View>
        </Animated.View>
      </View>

      {/* Date Display */}
      <View className="mt-4 px-4">
        <Text className="text-sm text-textSecondary">
          Created:<Text className="font-semibold text-textPrimary"> {formattedDate}</Text>
        </Text>
      </View>

      {/* Content flows naturally below thumbnails */}
      <View
        className="mt-12 w-full flex-1"
        style={{ borderTopLeftRadius: 44, borderTopRightRadius: 44 }}>
        <View className="flex-1 justify-center px-10">
          <Button
            title="Share"
            variant="primary"
            className="w-full"
            size="lg"
            icon={{
              family: ICON_FAMILY_NAME.FontAwesome,
              name: 'send',
              position: 'left',
            }}
            onPress={() => onShare(item.imageUrl, title)}
          />
        </View>
      </View>
    </>
  )
}
