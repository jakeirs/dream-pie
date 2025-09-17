import React from 'react'
import { View } from 'react-native'
import PhotoCard from '@/components/ui/PhotoCard/PhotoCard'

const PhotoCardGrid = () => {
  const handleSelfiePress = () => {
    console.log('Selfie card pressed')
  }

  const handlePosePress = () => {
    console.log('Pose card pressed')
  }

  return (
    <View className="flex-row gap-2 px-2">
      <View className="flex-1">
        <PhotoCard
          title="Your Selfie"
          onClickCard={handleSelfiePress}
        />
      </View>
      <View className="flex-1">
        <PhotoCard
          title="Your Pose"
          onClickCard={handlePosePress}
        />
      </View>
    </View>
  )
}

export default PhotoCardGrid