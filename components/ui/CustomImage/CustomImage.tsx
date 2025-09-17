import { View, ViewStyle } from 'react-native'
import { Image, ImageProps } from 'expo-image'

interface CustomImageProps extends Omit<ImageProps, 'source'> {
  source: string | number | { uri: string }
  width?: number | string
  height?: number | string
  borderRadius?: number
  containerStyle?: ViewStyle
  placeholder?: string
  blurhash?: string
  priority?: 'low' | 'normal' | 'high'
  cachePolicy?: 'memory' | 'disk' | 'memory-disk' | 'none'
}

export default function CustomImage({
  source,
  width = 100,
  height = 100,
  borderRadius = 0,
  containerStyle,
  placeholder,
  blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
  priority = 'normal',
  cachePolicy = 'memory-disk',
  contentFit = 'cover',
  transition = 200,
  ...props
}: CustomImageProps) {
  const imageStyle = {
    width,
    height,
    borderRadius,
  }

  return (
    <View style={[{ borderRadius }, containerStyle]}>
      <Image
        source={source}
        style={imageStyle}
        placeholder={blurhash}
        contentFit={contentFit}
        transition={transition}
        priority={priority}
        cachePolicy={cachePolicy}
        {...props}
      />
    </View>
  )
}

// Re-export assets for backward compatibility
export { appAssets as imageAssets } from '@/shared/assets/assets'