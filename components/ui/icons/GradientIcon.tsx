import { View } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg'

import { Icon } from './Icon'
import { ICON_FAMILY_NAME } from './constants'

interface GradientIconProps {
  family: ICON_FAMILY_NAME
  name: string
  size?: number
  gradientColors: [string, string]
  gradientId?: string
}

export const GradientIcon = ({
  family,
  name,
  size = 48,
  gradientColors,
  gradientId = 'iconGradient',
}: GradientIconProps) => {
  return (
    <View
      style={{
        width: size * 1.5,
        height: size * 1.5,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Svg width={size * 1.5} height={size * 1.5} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors[0]} stopOpacity="1" />
            <Stop offset="100%" stopColor={gradientColors[1]} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle cx="50" cy="50" r="45" fill={`url(#${gradientId})`} />
      </Svg>
      <View
        style={{
          position: 'absolute',
        }}>
        <Icon family={family} name={name} size={size} color="white" />
      </View>
    </View>
  )
}
