import React, { useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import { useAppStores } from '@/stores'
import { Button } from '@/components/ui'
import { Pose } from '@/types/dream'

export default function PoseLibraryPage() {
  const { pose, subscription, navigation } = useAppStores()

  useEffect(() => {
    pose.loadPoses()
  }, [])

  const handlePoseSelect = (selectedPose: Pose) => {
    if (selectedPose.isPremium && !subscription.canAccessPremiumPoses()) {
      navigation.openBottomSheet('paywall')
      return
    }

    pose.selectPose(selectedPose)
    navigation.closeBottomSheet('poseLibrary')
  }

  const handleClose = () => {
    navigation.closeBottomSheet('poseLibrary')
  }

  const renderPose = ({ item }: { item: Pose }) => {
    const isSelected = pose.selectedPose?.id === item.id
    const needsPremium = item.isPremium && !subscription.canAccessPremiumPoses()

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
        <Button variant="secondary" size="small" onPress={handleClose}>
          Done
        </Button>
      </View>

      <FlatList
        data={pose.filteredPoses}
        renderItem={renderPose}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}