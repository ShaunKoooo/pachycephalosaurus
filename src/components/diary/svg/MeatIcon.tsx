import React from 'react';
import Svg, {Rect, Circle, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

interface MeatIconProps {
  width?: number;
  height?: number;
}

const MeatIcon: React.FC<MeatIconProps> = ({width = 88, height = 88}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 88 88" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_13901_26537"
          x1="44.0032"
          y1="1.6688e-06"
          x2="72"
          y2="77.5"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#D5B2F5" />
          <Stop offset="1" stopColor="#A363DF" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_13901_26537"
          x1="31.8838"
          y1="59.1796"
          x2="45.3591"
          y2="10.3591"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#9F6CCE" stopOpacity="0" />
          <Stop offset="1" stopColor="#A96FDF" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_13901_26537"
          x1="66.5"
          y1="30"
          x2="56"
          y2="83"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#A96FDF" />
          <Stop offset="1" stopColor="#9F6CCE" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect width="88.0064" height="88.0029" rx="44.0015" fill="url(#paint0_linear_13901_26537)" />
      <Circle
        cx="31.1796"
        cy="32.1796"
        r="27"
        transform="rotate(-180 31.1796 32.1796)"
        fill="url(#paint1_linear_13901_26537)"
        fillOpacity="0.9"
      />
      <Circle cx="56" cy="56" r="27" fill="url(#paint2_linear_13901_26537)" fillOpacity="0.9" />
      <Path
        d="M50.6327 23.8354C58.5127 23.3354 67.4627 27.2254 68.2227 36.0754C68.5527 39.9254 68.6527 51.2254 67.2627 54.4254C61.7327 67.1954 40.5627 63.9754 30.0927 60.5254C25.7727 59.0954 19.4427 56.1154 18.7427 50.9454C18.4027 48.4454 18.4027 40.9654 18.7027 38.4454C19.5827 31.2054 31.0627 30.9754 36.1427 29.2454C41.7127 27.3354 43.5627 24.2854 50.6227 23.8354H50.6327ZM48.9427 27.2054C44.0927 27.7854 41.6927 30.8254 37.7527 32.2054C33.2527 33.7754 14.5127 35.1154 24.6027 43.7054C32.9827 50.8354 63.1327 55.2754 64.8427 39.4654C65.9227 29.4754 57.5227 26.1754 48.9427 27.2054ZM65.1727 46.4054C59.1227 54.2654 49.4727 54.1754 40.4827 52.7854C33.9727 51.7754 26.9627 49.7454 21.9127 45.3954C21.2227 45.3054 21.4827 45.4254 21.4127 45.8954C21.0827 48.3054 21.7627 51.2554 23.2927 53.1454C26.4727 57.0654 38.4627 59.6854 43.4627 60.2754C53.2127 61.4354 66.7027 59.1954 65.1727 46.4054Z"
        fill="white"
      />
      <Path
        d="M41.4427 39.6354C43.6427 39.4254 47.4527 38.3854 49.0327 36.7754C49.9627 35.8254 50.6027 33.2754 52.4928 34.5354C54.2528 35.7054 51.4028 38.9254 50.3327 39.7754C49.7627 40.2254 46.8527 41.4554 48.5027 41.6654C49.8327 41.8354 53.8927 41.1454 54.0828 43.2054C54.1828 44.3154 52.8827 45.0554 51.8827 45.0554C48.5527 45.0554 39.7827 43.9154 36.7927 42.6054C34.7727 41.7254 35.2127 39.6354 36.0527 39.6354C37.7627 39.6354 39.7827 39.7854 41.4427 39.6354Z"
        fill="white"
      />
    </Svg>
  );
};

export default MeatIcon;
