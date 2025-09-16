import React, { useEffect } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native'
import { PageHeader, ICON_FAMILY_NAME } from '@/components/ui'
import { useAppStores } from '@/stores'
import { Creation } from '@/types/dream'
import { router } from 'expo-router'

export default function GalleryPage() {
  const { gallery, actions, navigation } = useAppStores()

  useEffect(() => {
    // Load gallery when component mounts
    gallery.loadGallery('user_1')
  }, [])

  const handleCreationPress = (creation: Creation) => {
    actions.viewGalleryItem(creation)
    router.push('/(creation)/result')
  }

  const renderCreation = ({ item }: { item: Creation }) => (
    <TouchableOpacity
      className="flex-1 m-1 bg-card rounded-xl overflow-hidden"
      onPress={() => handleCreationPress(item)}
      style={{ aspectRatio: 0.8 }}>

      <Image
        source={typeof item.resultImage === 'string' ? { uri: item.resultImage } : item.resultImage}
        className="w-full flex-1"
        resizeMode="cover"
      />

      <View className="p-3">
        <Text className="text-sm font-medium text-textPrimary" numberOfLines={1}>
          {item.selectedPose.name}
        </Text>
        <Text className="text-xs text-textSecondary mt-1">
          {item.selectedPose.category.charAt(0).toUpperCase() + item.selectedPose.category.slice(1)}
        </Text>
        <Text className="text-xs text-textMuted mt-1">
          {new Date(item.generatedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Text className="text-6xl mb-4">📸</Text>
      <Text className="text-xl font-semibold text-textPrimary mb-2">
        No photos yet
      </Text>
      <Text className="text-textSecondary text-center mb-8 px-8">
        Create your first AI-generated photo to see it here
      </Text>
      <TouchableOpacity
        className="bg-primary px-6 py-3 rounded-xl"
        onPress={() => router.push('/(tabs)/index')}>
        <Text className="font-semibold" style={{ color: '#000000' }}>
          Create First Photo
        </Text>
      </TouchableOpacity>
    </View>
  )

  const HeaderStats = () => (
    <View className="px-6 py-4 bg-cardSecondary mx-6 rounded-xl mb-6">
      <View className="flex-row justify-between items-center">
        <View className="items-center">
          <Text className="text-2xl font-bold text-textPrimary">
            {gallery.savedCreations.length}
          </Text>
          <Text className="text-sm text-textSecondary">Photos</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-textPrimary">
            {gallery.getFavoriteCategory()}
          </Text>
          <Text className="text-sm text-textSecondary">Favorite Style</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-textPrimary">
            {gallery.getLatestCreation() ? '1' : '0'}
          </Text>
          <Text className="text-sm text-textSecondary">This Week</Text>
        </View>
      </View>
    </View>
  )

  return (
    <View className="flex-1 bg-background">
      <PageHeader
        title="My Gallery"
        rightIcon={{
          name: 'settings',
          family: ICON_FAMILY_NAME.Feather,
          onPress: () => navigation.openBottomSheet('settings')
        }}
      />

      {gallery.savedCreations.length > 0 && <HeaderStats />}

      {gallery.savedCreations.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={gallery.savedCreations}
          renderItem={renderCreation}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100
          }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  )
}
