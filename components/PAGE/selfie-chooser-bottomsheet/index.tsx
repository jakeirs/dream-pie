import { View } from 'react-native'

import { SelfieHeader } from './components/SelfieHeader'
import { SelfieGrid } from './components/SelfieGrid'

import { SelfieChooserPageProps } from './types'

export default function SelfieChooserBottomSheet({ onClose }: SelfieChooserPageProps) {
  return (
    <View className="bg-backgroundPrimary flex-1">
      <SelfieHeader onClose={onClose} />
      <SelfieGrid />
    </View>
  )
}
