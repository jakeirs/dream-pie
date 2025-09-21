import { View } from 'react-native'

import GenerateButton from './GenerateButton'

interface BottomProps {}

export function Bottom({}: BottomProps) {
  return (
    <>
      <View className="flex-1">
        {/* Generate Photo Button with Result Display */}
        <GenerateButton />
      </View>
    </>
  )
}
