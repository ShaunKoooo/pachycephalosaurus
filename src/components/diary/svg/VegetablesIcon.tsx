import React from 'react';
import Svg, {Rect, Circle, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

interface VegetablesIconProps {
  width?: number;
  height?: number;
}

const VegetablesIcon: React.FC<VegetablesIconProps> = ({width = 88, height = 88}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 88 88" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_13901_26538"
          x1="-6.63067e-07"
          y1="3.1144"
          x2="62.2845"
          y2="88.0059"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#66D2A9" />
          <Stop offset="1" stopColor="#169E6B" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_13901_26538"
          x1="30.1838"
          y1="7.18378"
          x2="30.1838"
          y2="61.1838"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#169E6B" />
          <Stop offset="1" stopColor="#169E6B" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_13901_26538"
          x1="54"
          y1="30"
          x2="54"
          y2="84"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#169E6B" />
          <Stop offset="1" stopColor="#169E6B" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect width="87.9989" height="88.0059" rx="43.9995" fill="url(#paint0_linear_13901_26538)" />
      <Circle
        cx="30.1838"
        cy="34.1838"
        r="27"
        transform="rotate(-180 30.1838 34.1838)"
        fill="url(#paint1_linear_13901_26538)"
        fillOpacity="0.9"
      />
      <Circle cx="54" cy="57" r="27" fill="url(#paint2_linear_13901_26538)" fillOpacity="0.9" />
      <Path
        d="M42.3002 65.1741C36.2602 64.8141 30.9202 62.4441 27.3802 57.4441C18.8302 45.3641 28.0902 31.3941 36.6302 22.4341C37.4102 21.6141 42.8602 16.3541 43.3402 16.1941C44.7302 15.7441 45.4502 16.6541 46.4602 17.5041C57.6602 26.9241 72.6302 47.3441 58.0902 60.3441C54.4102 63.6341 50.5902 64.6941 45.7902 65.3841C45.2702 67.1541 47.0202 74.6341 43.6002 73.6041C41.2902 72.9041 42.7302 67.1241 42.2902 65.1741H42.3002ZM45.6902 62.0341C54.9702 61.0941 62.0402 53.7241 60.3502 44.0741C59.0402 36.5941 51.9102 27.5641 46.4802 22.4441C46.2302 22.2041 46.1102 21.9741 45.7002 22.0641V43.0941C48.3302 42.3041 52.0802 34.0141 54.2502 38.8041L53.7102 40.1041L45.7002 48.1541V62.0441L45.6902 62.0341ZM42.3302 22.3141C41.8802 22.2041 41.8102 22.5041 41.5502 22.7041C37.6702 25.6941 31.1002 34.5741 29.2102 39.1241C24.5902 50.2441 30.4502 60.7741 42.3302 62.0341V45.5541C40.4102 43.0541 36.7102 40.6341 34.9502 38.1641C33.7402 36.4641 34.8902 34.6041 36.6502 35.1441C37.8002 35.4941 40.9402 39.4941 42.3302 40.2241V22.3141Z"
        fill="white"
      />
    </Svg>
  );
};

export default VegetablesIcon;
