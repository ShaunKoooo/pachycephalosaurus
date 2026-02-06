import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/theme';

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onHide: () => void;
  backgroundColor?: string;
  type?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({
  message,
  visible,
  duration = 3000,
  onHide,
  backgroundColor,
  type = 'success',
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  // 根據 type 決定背景色，如果有自訂 backgroundColor 則優先使用
  const bgColor = backgroundColor || (type === 'error' ? '#FF3B30' : Colors.primaryLight);

  useEffect(() => {
    if (visible) {
      // 重置並淡入
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // 持續顯示後淡出
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // 當 visible 為 false 時重置 opacity
      opacity.setValue(0);
    }
  }, [visible, duration, opacity]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={[styles.toast, { backgroundColor: bgColor }]}>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});
