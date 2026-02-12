import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface AddDiaryIconProps {
  width?: number;
  height?: number;
  opacity?: number;
}

export default function AddDiaryIcon({
  width = 32,
  height = 32,
  opacity = 0.7
}: AddDiaryIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 54 54" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear"
          x1="23.3321"
          y1="53.4558"
          x2="53.4495"
          y2="23.3317"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#169E6B" />
          <Stop offset="1" stopColor="#00C2E0" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear"
          x1="0"
          y1="30.124"
          x2="30.1241"
          y2="0.00665549"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#169E6B" />
          <Stop offset="1" stopColor="#00C2E0" />
        </LinearGradient>
      </Defs>
      <Path
        d="M23.3321 53.4558V39.6149C23.3321 30.6397 30.6334 23.3384 39.6072 23.3384H53.4562V30.1346H30.1283V53.4558H23.3321Z"
        fill="url(#paint0_linear)"
        fillOpacity={opacity}
      />
      <Path
        d="M0 30.124H13.8409C22.8161 30.124 30.1174 22.8227 30.1174 13.8489V-5.91278e-05H23.3212V23.3278H0V30.124Z"
        fill="url(#paint1_linear)"
        fillOpacity={opacity}
      />
    </Svg>
  );
}
