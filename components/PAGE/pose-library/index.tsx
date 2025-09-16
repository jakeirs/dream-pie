import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import { Button } from '@/components/ui'
import { Pose } from '@/types/dream'
import { mockPoses, mockSubscriptions } from '@/mockData/dream'

interface PoseLibraryPageProps {
  onClose: () => void
  onPoseSelect?: (pose: Pose) => void
}

export default function PoseLibraryPage({ onClose, onPoseSelect }: PoseLibraryPageProps) {
  const [poses, setPoses] = useState<Pose[]>([])
  const [selectedPose, setSelectedPose] = useState<Pose | null>(null)
  const [subscription] = useState(mockSubscriptions[0]) // Free tier

  useEffect(() => {
    setPoses(mockPoses)
  }, [])

  const handlePoseSelect = (pose: Pose) => {
    if (pose.isPremium && subscription.tier === 'free') {
      // TODO: Need to open paywall modal - for now just return
      return
    }

    setSelectedPose(pose)
    onPoseSelect?.(pose)
    onClose()
  }

  const renderPose = ({ item }: { item: Pose }) => {
    const isSelected = selectedPose?.id === item.id
    const needsPremium = item.isPremium && subscription.tier === 'free'

    return (
      <TouchableOpacity
        className={`flex-1 m-2 bg-card rounded-xl overflow-hidden ${
          isSelected ? 'border-2 border-primary' : ''
        }`}
        onPress={() => handlePoseSelect(item)}
        style={{ aspectRatio: 0.75 }}>

        <Image
          source={item.imageUrl}
          className="w-full flex-1"
          resizeMode="cover"
        />

        {item.isPremium && (
          <View className="absolute top-2 right-2 bg-warning px-2 py-1 rounded">
            <Text className="text-xs font-bold text-white">👑 PRO</Text>
          </View>
        )}

        <View className="p-3">
          <Text className="text-sm font-medium text-textPrimary" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-xs text-textSecondary">
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
        </View>

        {needsPremium && (
          <View className="absolute inset-0 bg-black/50 items-center justify-center">
            <Text className="text-white font-bold">Upgrade to Pro</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row justify-between items-center p-6 border-b border-borderLight">
        <Text className="text-xl font-bold text-textPrimary">Choose a Pose</Text>
        <Button variant="secondary" size="small" onPress={onClose}>
          <Text>Done</Text>
        </Button>
      </View>

      <FlatList
        data={poses}
        renderItem={renderPose}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}