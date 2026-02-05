import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LoginFooter, EmailLoginForm, PhoneLoginForm } from '@/components/auth';
import { LogoPortrait } from '@/components/logos';
import { useAppDispatch } from '@/store/hooks';
import { loginWithPhone } from '@/store/slices/authSlice';

type LoginMethod = 'phone' | 'email';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');

  const handlePhoneLogin = async (phone: string, verificationCode: string) => {
    try {
      await dispatch(loginWithPhone({ phone, verificationCode })).unwrap();
      console.log('✅ 登入成功');
    } catch (error: any) {
      console.error('❌ 登入失敗:', error);
      Alert.alert('登入失敗', error || '請稍後再試');
    }
  };

  const handleEmailLogin = async (email: string, password: string) => {
    // TODO: 實作 email 登入
    console.log('Email 登入:', email);
    Alert.alert('提示', 'Email 登入功能開發中');
  };

  const handleForgotPassword = () => {
    // TODO: 導航到忘記密碼頁面
    Alert.alert('提示', '忘記密碼功能開發中');
  };

  const toggleLoginMethod = () => {
    setLoginMethod((prev) => (prev === 'phone' ? 'email' : 'phone'));
  };

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
              onLogin={handleEmailLogin}
              onForgotPassword={handleForgotPassword}
            />
          )}
          {/* 切換登入方式 */}
          {/* <TouchableOpacity style={styles.switchButton} onPress={toggleLoginMethod}>
            <Text style={styles.switchButtonText}>
              {loginMethod === 'phone' ? '以專家身份登入' : '使用手機登入'}
            </Text>
          </TouchableOpacity> */}
        </View>

        {/* 底部資訊 - 固定在最下方 */}
        <LoginFooter />
      </ScrollView>
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
  switchButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchButtonText: {
    color: '#000000',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
