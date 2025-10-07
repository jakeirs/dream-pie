import { View } from 'react-native'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'

import { Icon } from './Icon'
import { ICON_FAMILY_NAME } from './constants'

interface GradientIconProps {
  family: ICON_FAMILY_NAME
  name: string
  size?: number
  gradientColors: [string, string]
  gradientId?: string
}

export const GradientIcon = ({ family, name, size = 48, gradientColors }: GradientIconProps) => {
  return (
    <MaskedView 
      style={{ width: size, height: size }}
      maskElement={
        <View
          style={{
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon family={family} name={name} size={size} color="black" />
        </View>
      }>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, width: size, height: size }}
      />
    </MaskedView>
  )
}
