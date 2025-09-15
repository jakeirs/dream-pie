import { TouchableOpacity } from "react-native";
import { ICON_FAMILY_NAME, IconFamilies } from "./constants";

interface IIconButtonProps {
  family: ICON_FAMILY_NAME;
  name: string;
  size?: number;
  onPress?: any;
  color?: string;
}

// https://icons.expo.fyi/Index
export const IconButton = ({
  family,
  name,
  size = 24,
  onPress,
  color,
}: IIconButtonProps) => {
  const IconComponent = IconFamilies[family];

  if (!IconComponent) {
    console.warn(`Icon family "${family}" not found`);
    return null;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
    >
      <IconComponent
        family={family}
        name={name}
        size={size}
        color={color ? color : "white"}
      />
    </TouchableOpacity>
  );
};