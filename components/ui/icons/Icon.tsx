import React from 'react';
import {
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  AntDesign
} from '@expo/vector-icons';
import { ICON_FAMILY_NAME } from './constants';

interface IconProps {
  family: ICON_FAMILY_NAME;
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ family, name, size = 24, color = '#000' }: IconProps) {
  switch (family) {
    case ICON_FAMILY_NAME.FontAwesome5:
      return (
        <FontAwesome5
          name={name as any}
          size={size}
          color={color}
        />
      );
    case ICON_FAMILY_NAME.MaterialIcons:
      return (
        <MaterialIcons
          name={name as any}
          size={size}
          color={color}
        />
      );
    case ICON_FAMILY_NAME.Ionicons:
      return (
        <Ionicons
          name={name as any}
          size={size}
          color={color}
        />
      );
    case ICON_FAMILY_NAME.AntDesign:
      return (
        <AntDesign
          name={name as any}
          size={size}
          color={color}
        />
      );
    default:
      return (
        <FontAwesome5
          name="question"
          size={size}
          color={color}
        />
      );
  }
}