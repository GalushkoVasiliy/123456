import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
const CloseIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={100}
    height={100}
    viewBox="0 0 50 50"
    {...props}>
    <Path d="M7.719 6.281 6.28 7.72 23.563 25 6.28 42.281 7.72 43.72 25 26.437 42.281 43.72l1.438-1.438L26.437 25 43.72 7.719 42.28 6.28 25 23.563Z" />
  </Svg>
);
export default CloseIcon;
