import React from 'react';
import Svg, {Rect, Circle, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

interface OilIconProps {
  width?: number;
  height?: number;
}

const OilIcon: React.FC<OilIconProps> = ({width = 88, height = 87}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 88 87" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_13901_26540"
          x1="12.5"
          y1="5.7208e-08"
          x2="75"
          y2="87"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FDE6A8" />
          <Stop offset="1" stopColor="#FFBB00" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_13901_26540"
          x1="30"
          y1="6"
          x2="30"
          y2="60"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFBB00" />
          <Stop offset="1" stopColor="#FFBB00" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_13901_26540"
          x1="53"
          y1="30"
          x2="53"
          y2="84"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFBB00" />
          <Stop offset="1" stopColor="#FFBB00" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect width="87.4241" height="86.9233" rx="43.4617" fill="url(#paint0_linear_13901_26540)" />
      <Circle cx="30" cy="33" r="27" transform="rotate(-180 30 33)" fill="url(#paint1_linear_13901_26540)" />
      <Circle cx="53" cy="57" r="27" fill="url(#paint2_linear_13901_26540)" />
      <Path
        d="M43.37 17.1978C43.78 17.1178 44.08 17.1478 44.48 17.2778C45.17 17.5078 51.61 25.8778 52.65 27.2278C60.52 37.4678 68.43 47.7778 58.05 60.0578C44.01 76.6678 19.67 61.1578 25.18 41.9478C26.69 36.6778 37.36 22.8578 41.45 18.6578C41.97 18.1278 42.59 17.3378 43.36 17.1878L43.37 17.1978ZM44.12 21.4978L43.12 21.9978C39.04 28.7178 28.72 37.0478 28.01 45.1078C26.54 61.9878 46.59 70.8578 56.53 56.5178C66.47 42.1778 50.41 32.3478 44.12 21.4878V21.4978Z"
        fill="white"
      />
      <Path
        d="M33.62 48.3778C35.97 47.5678 36.61 51.0578 37.76 52.5178C39.04 54.1478 40.76 55.3578 42.77 55.8878C43.83 56.1678 46.41 55.7478 46.47 57.5378C46.58 61.3178 39.35 58.4078 37.6 57.0378C36.26 55.9878 30.58 49.4378 33.62 48.3878V48.3778Z"
        fill="white"
      />
    </Svg>
  );
};

export default OilIcon;
