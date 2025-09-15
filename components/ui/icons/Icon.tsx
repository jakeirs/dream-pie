import { ICON_FAMILY_NAME, IconFamilies } from "./constants"

interface IIconProps {
  family: ICON_FAMILY_NAME
  name: string
  size?: number
  color?: string
}

// pass as family e.g. ICON_FAMILY_NAME.FontAwesome6 | not just FontAwesome6
// to avoid error of displayName of undefined
// https://icons.expo.fyi/Index
export const Icon = ({ family, name, size = 24, color }: IIconProps) => {
  const IconComponent = IconFamilies[family]

  return (
    <IconComponent
      family={family}
      name={name}
      size={size}
      color={color ?? "white"}
    />
  )
}