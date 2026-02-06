import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { LoginFooter, EmailLoginForm, PhoneLoginForm } from '@/components/auth';
import { LogoPortrait } from '@/components/logos';
import { FontelloIcon, Toast } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginWithPhone, setLoginMethod } from '@/store/slices/authSlice';
import { Colors } from '@/theme';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const loginMethod = useAppSelector((state) => state.auth.loginMethod);
  const [showSwitchIcon, setShowSwitchIcon] = useState(false);
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    console.log('🔔 LoginPage.showToast called:', { message, type, currentVisible: toastVisible });
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handlePhoneLogin = async (phone: string, verificationCode: string) => {
    try {
      await dispatch(loginWithPhone({ phone, verificationCode })).unwrap();
      console.log('✅ 登入成功');
    } catch (error: any) {
      console.error('❌ 登入失敗:', error);
      Alert.alert('登入失敗', error || '請稍後再試');
    }
  };

  const handleForgotPassword = () => {
    // TODO: 導航到忘記密碼頁面
    Alert.alert('提示', '忘記密碼功能開發中');
  };

  useEffect(() => {
    if (showSwitchIcon) {
      // 顯示動畫：由下往上滑入 + 淡入
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 重置動畫值
      slideAnim.setValue(50);
      fadeAnim.setValue(0);
    }
  }, [showSwitchIcon]);

  useEffect(() => {
    console.log('🔔 Toast state changed:', { toastVisible, toastMessage, toastType });
  }, [toastVisible, toastMessage, toastType]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.mainContent}>
          {/* Logo */}
          <View>
            <LogoPortrait />
          </View>

          {/* 登入表單 */}
          {loginMethod === 'phone' ? (
            <PhoneLoginForm onLogin={handlePhoneLogin} />
          ) : (
            <EmailLoginForm
              onForgotPassword={handleForgotPassword}
              showToast={showToast}
            />
          )}

          {/* 切換登入方式 */}
          <View style={styles.switchContainer}>
            <TouchableOpacity onPress={() => setShowSwitchIcon(!showSwitchIcon)}>
              <Text style={styles.switchText}>或使用其他登入方式</Text>
            </TouchableOpacity>
            {showSwitchIcon && (
              <Animated.View
                style={[
                  styles.iconContainer,
                  {
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim,
                  },
                ]}
              >
                {loginMethod === 'phone' ? (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                      dispatch(setLoginMethod('email'));
                      setShowSwitchIcon(false);
                    }}
                  >
                    <FontelloIcon
                      name="ic_mail_24px"
                      size={24}
                      color={'white'}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                      dispatch(setLoginMethod('phone'));
                      setShowSwitchIcon(false);
                    }}
                  >
                    <FontelloIcon
                      name="ic_phone_iphone_24px"
                      size={24}
                      color={'white'}
                    />
                  </TouchableOpacity>
                )}
              </Animated.View>
            )}
          </View>
        </View>

        {/* 底部資訊 - 固定在最下方 */}
        <LoginFooter />
      </ScrollView>

      {/* Toast 提示 */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        duration={3000}
        type={toastType}
        onHide={() => {
          console.log('🔔 Toast onHide called');
          setToastVisible(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 36,
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
  },
  title: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  switchContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  switchText: {
    color: Colors.primary,
    fontSize: 14,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EA5455',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
