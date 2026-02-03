import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import fontelloConfig from '../../assets/fonts/config.json';

// 從 fontello config 自動生成 icon mapping
const iconMap: Record<string, string> = {};
fontelloConfig.glyphs.forEach((glyph: any) => {
  iconMap[glyph.css] = String.fromCharCode(glyph.code);
});

export type IconName = keyof typeof iconMap;

interface FontelloIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const FontelloIcon: React.FC<FontelloIconProps> = ({
  name,
  size = 24,
  color = '#000',
  style,
}) => {
  const iconCode = iconMap[name] || name;

  return (
    <Text
      style={[
        {
          fontFamily: 'fontello',
          fontSize: size,
          color: color,
        },
        style,
      ]}>
      {iconCode}
    </Text>
  );
};
