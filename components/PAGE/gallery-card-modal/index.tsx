import { View, StyleSheet } from 'react-native'
import { Image } from 'expo-image'

import ZoomablePhoto from '@/components/ui/ZoomablePhoto/ZoomablePhoto'
import CreationContent from './components/CreationContent'
import PoseContent from './components/PoseContent'
import SelfieContent from './components/SelfieContent'

import { useGalleryImage, useImageShare } from './hooks'
import { isCreation, isPose, isSelfie } from './types'

import { GalleryContent } from '@/types'

interface GalleryCardModalProps {
  item: GalleryContent
  onClose: () => void
}

export default function GalleryCardModal({ item, onClose }: GalleryCardModalProps) {
  // Determine the image URI based on item type
  const imageUri = 'imageUrl' in item ? item.imageUrl : ''

  const { image, imageAspectRatio, thumbnailAnimatedStyle, handleZoomStart, handleZoomEnd } =
    useGalleryImage(imageUri)
  const { handleShare } = useImageShare()

  return (
    <View className="min-h-full pb-6">
      <View className="relative min-h-full">
        {/* Zoomable Image Container with dynamic aspectRatio and max height */}
        <View
          className="w-full items-center"
          style={{
            zIndex: 10,
          }}>
          {/* Blurred Background Layer - Full Width Behind Everything */}
          {image && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                maxHeight: 500,
              }}>
              <Image
                source={imageUri}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                blurRadius={100}
              />
            </View>
          )}
          <View
            style={{
              aspectRatio: imageAspectRatio,
              maxHeight: 500,
              width: '100%',
            }}>
            {/* Zoomable Photo on Top */}
            {image && (
              <ZoomablePhoto
                imageSource={image}
                scaleFromCenter={false}
                contentFit="contain"
                onZoomStart={handleZoomStart}
                onZoomEnd={handleZoomEnd}
              />
            )}
          </View>
        </View>

        {/* Conditional Content Based on Item Type */}
        {isCreation(item) && (
          <CreationContent
            item={item}
            thumbnailAnimatedStyle={thumbnailAnimatedStyle}
            onShare={handleShare}
          />
        )}
        {isPose(item) && <PoseContent item={item} />}
        {isSelfie(item) && <SelfieContent item={item} />}
      </View>
    </View>
  )
}
