import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../selection.json';
const IconCustom = createIconSetFromIcoMoon(icoMoonConfig);

interface Props {
  iconName: string;
  size: number;
  color: string;
}

const IconComponent = ({iconName, size, color}: Props) => {
  return iconName.indexOf("RYMAN_APP") > -1 ? <IconCustom name={iconName} size={size} color={color} /> : <Icon name={iconName} size={size} color={color} />;
};

export default React.memo(IconComponent);
