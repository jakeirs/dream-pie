import { View } from 'react-native'

import GenerateButton from './Bottom/GenerateButton'
import CollageGenerator from './Bottom/CollageGenerator/CollageGenerator'
import PoseAnalyzer from './Bottom/PoseAnalyzer/PoseAnalyzer'

interface BottomProps {}

export function Bottom({}: BottomProps) {
  return (
    <>
      <View className="flex-1">
        <GenerateButton />

        <PoseAnalyzer />

        <CollageGenerator />
      </View>
    </>
  )
}
