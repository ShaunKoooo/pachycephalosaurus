import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '@/theme';

interface MyButtonProps {
  title: string;
  onPress: () => void;
  isActive?: boolean;
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const MyButton: React.FC<MyButtonProps> = ({
  title,
  onPress,
  isActive = true,
  isLoading = false,
  style,
  textStyle,
}) => {
  const disabled = !isActive || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        !isActive && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color="#000" />
      ) : (
        <Text style={[
          styles.buttonText,
          textStyle,
          !isActive && styles.disabledTitleStyle
        ]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: '#F2F3F5',
  },
  disabledTitleStyle: {
    color: '#030304'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
