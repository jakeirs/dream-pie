import { View, Text } from 'react-native'

import { FilterType } from '@/types/dream/gallery'

interface EmptyStateProps {
  activeFilter: FilterType
}

export default function EmptyState({ activeFilter }: EmptyStateProps) {
  const getEmptyStateMessage = () => {
    switch (activeFilter) {
      case 'creations':
        return 'Create your first photo to see it here!'
      case 'poses':
        return 'Browse poses to add to your collection!'
      case 'selfies':
        return 'Add selfies to use in your creations!'
      default:
        return 'No items found'
    }
  }

  const getEmptyStateTitle = () => {
    switch (activeFilter) {
      case 'creations':
        return 'No Creations Yet'
      case 'poses':
        return 'No Poses Yet'
      case 'selfies':
        return 'No Selfies Yet'
      default:
        return 'No Items Yet'
    }
  }

  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="mb-4 text-center text-2xl font-bold text-textPrimary">
        {getEmptyStateTitle()}
      </Text>
      <Text className="text-center text-textSecondary">
        {getEmptyStateMessage()}
      </Text>
    </View>
  )
}