import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import Button from '@/components/ui/Button/Button'
import { Pose } from '@/types/dream'
import { mockPoses, mockSubscriptions } from '@/mockData/dream'

interface PoseLibraryPageProps {
  onClose: () => void
}

export default function PoseLibraryPage({ onClose }: PoseLibraryPageProps) {
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
    onClose()
  }

  const renderPose = ({ item }: { item: Pose }) => {
    const isSelected = selectedPose?.id === item.id
    const needsPremium = item.isPremium && subscription.tier === 'free'

    return (
      <TouchableOpacity
        className={`m-2 flex-1 overflow-hidden rounded-xl bg-card ${
          isSelected ? 'border-2 border-primary' : ''
        }`}
        onPress={() => handlePoseSelect(item)}
        style={{ aspectRatio: 0.75 }}>
        <Image source={item.imageUrl} className="w-full flex-1" resizeMode="cover" />

        {item.isPremium && (
          <View className="absolute right-2 top-2 rounded bg-warning px-2 py-1">
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
          <View className="absolute inset-0 items-center justify-center bg-black/50">
            <Text className="font-bold text-white">Upgrade to Pro</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between border-b border-borderLight p-6">
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
