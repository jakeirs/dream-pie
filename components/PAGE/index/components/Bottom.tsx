import { View } from 'react-native'

import GenerateButton from './Bottom/GenerateButton'
import CollageGenerator from './Collage'

interface BottomProps {}

export function Bottom({}: BottomProps) {
  return (
    <>
      <View className="flex-1">
        {/* Generate Photo Button with Result Display */}
        <GenerateButton />

        {/* Collage Generator */}
        <CollageGenerator />
      </View>
    </>
  )
}
