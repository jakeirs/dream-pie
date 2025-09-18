// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View } from 'react-native'

// 2. Same tree components (local to current page)
import { PoseHeader } from './components/PoseHeader'
import { PoseGrid } from './components/PoseGrid'

// 3. Constants, Types, Mock Data
import { PoseLibraryPageProps } from './types'

export default function PoseLibraryPage({ onClose }: PoseLibraryPageProps) {
  return (
    <View className="flex-1 bg-background">
      <PoseHeader onClose={onClose} />
      <PoseGrid />
    </View>
  )
}
