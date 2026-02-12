import React from 'react';
import Svg, {Rect, Circle, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

interface MilkIconProps {
  width?: number;
  height?: number;
}

const MilkIcon: React.FC<MilkIconProps> = ({width = 88, height = 88}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 88 88" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_13901_26542"
          x1="44.0022"
          y1="0"
          x2="76"
          y2="88"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#80BDFF" />
          <Stop offset="1" stopColor="#2184EF" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_13901_26542"
          x1="30"
          y1="8"
          x2="30"
          y2="62"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2184EF" />
          <Stop offset="1" stopColor="#2184EF" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_13901_26542"
          x1="55"
          y1="30"
          x2="55"
          y2="84"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2184EF" />
          <Stop offset="1" stopColor="#2184EF" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect width="88.0043" height="88.0001" rx="44.0001" fill="url(#paint0_linear_13901_26542)" />
      <Circle
        cx="30"
        cy="35"
        r="27"
        transform="rotate(-180 30 35)"
        fill="url(#paint1_linear_13901_26542)"
        fillOpacity="0.9"
      />
      <Circle cx="55" cy="57" r="27" fill="url(#paint2_linear_13901_26542)" fillOpacity="0.9" />
      <Path
        d="M23.3161 65.1524C23.0261 64.7424 23.0261 64.2524 22.9861 63.7724C22.2861 55.3424 23.5161 45.9224 23.0061 37.3924L29.9261 26.4524C30.5161 24.6024 28.2861 20.2424 31.9861 20.0924C39.5261 20.5924 47.7861 19.4724 55.2361 20.0924C55.6861 20.1324 56.6061 20.2224 56.9261 20.4924C57.5061 20.9924 57.0361 25.6424 57.1761 26.8324C57.4261 28.9524 63.2461 34.4024 64.2161 36.8624L64.1061 64.9524L62.5461 65.4924C50.2961 64.6924 36.7961 66.5224 24.6861 65.4924C24.2061 65.4524 23.7261 65.4524 23.3261 65.1524H23.3161ZM54.0461 27.2324L53.8061 23.3924C53.6161 23.2624 53.3661 23.2924 53.1461 23.2624C49.9461 22.8624 36.8861 22.8124 33.8861 23.3424C33.6761 23.3824 33.2261 23.4524 33.1661 23.7124C33.3361 24.8324 32.7761 26.3724 33.5661 27.2324H54.0461ZM51.6961 30.3924H31.2161L27.4361 36.4624H46.6161C46.8561 36.4624 47.0061 36.7824 47.4561 36.3924L51.7061 30.4024L51.6961 30.3924ZM50.3961 37.6524V62.5824C53.6761 62.1224 57.3761 62.1924 60.6861 62.5524L61.0961 62.1824V38.7024C61.0961 36.9424 56.5761 32.7524 55.7361 30.9024L54.9661 31.1824L50.3961 37.6424V37.6524ZM47.2661 39.8924H26.3961V62.5824L47.2661 62.1824V39.8924Z"
        fill="white"
      />
    </Svg>
  );
};

export default MilkIcon;
