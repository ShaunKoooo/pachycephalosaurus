import React from 'react';
import Svg, {Rect, Circle, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

interface FruitIconProps {
  width?: number;
  height?: number;
}

const FruitIcon: React.FC<FruitIconProps> = ({width = 88, height = 88}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 88 88" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_13901_26539"
          x1="44.0017"
          y1="0"
          x2="73.5"
          y2="82.5"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFA5A5" />
          <Stop offset="1" stopColor="#FF7A7A" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_13901_26539"
          x1="30"
          y1="7"
          x2="30"
          y2="61"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF7A7A" />
          <Stop offset="1" stopColor="#FF7A7A" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_13901_26539"
          x1="54"
          y1="31"
          x2="54"
          y2="85"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF7A7A" />
          <Stop offset="1" stopColor="#FF7A7A" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect width="88.0035" height="88.0016" rx="44.0008" fill="url(#paint0_linear_13901_26539)" />
      <Circle cx="30" cy="34" r="27" transform="rotate(-180 30 34)" fill="url(#paint1_linear_13901_26539)" />
      <Circle cx="54" cy="58" r="27" fill="url(#paint2_linear_13901_26539)" />
      <Path
        d="M44.3328 26.5216C44.2928 23.9316 52.2128 18.9916 52.7328 22.6416C52.9828 24.4416 50.9228 24.5016 49.7328 25.3616C47.6528 26.8616 46.0928 29.4816 45.0228 31.7916C45.2828 32.1016 45.3828 32.2816 45.8228 32.2816C46.7528 32.3016 49.4828 31.1216 50.9228 30.9816C74.2128 28.6116 66.2728 67.4016 49.7828 67.8316C47.4828 67.8916 45.3128 66.4516 43.7828 66.3216C43.0028 66.2516 40.4328 67.4416 39.0928 67.5516C21.7828 68.9416 14.3728 28.7816 36.7428 30.6516C38.5228 30.8016 40.1828 31.6416 41.9828 31.6216C41.6028 28.7216 39.5028 25.4716 37.1328 23.8016C36.1928 23.1416 33.1528 22.3816 35.0228 20.5016C36.7328 18.7816 40.3128 21.8016 41.4828 23.1316C42.0028 23.7216 43.7928 26.9316 44.3228 26.5316L44.3328 26.5216ZM34.5328 34.0816C19.1928 35.5716 27.2628 65.9716 39.3928 64.1016C40.7428 63.8916 42.1028 62.7916 43.5028 62.7916C45.7628 62.7916 47.4228 64.5716 50.8828 64.1816C61.4428 63.0016 69.7528 31.7716 50.6328 34.4116C48.6528 34.6816 45.4428 36.6516 44.1728 36.6516C43.0128 36.6516 40.2228 34.8916 38.6428 34.4916C37.1528 34.1116 36.0928 33.9316 34.5428 34.0816H34.5328Z"
        fill="white"
      />
    </Svg>
  );
};

export default FruitIcon;