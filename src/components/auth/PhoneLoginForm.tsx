import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '@/theme';
import { MyButton } from '@/components';
import { CountryCodePicker } from './CountryCodePicker';
import { DEFAULT_COUNTRY, CountryCode } from '@/data/countryCodes';
import { useSendSmsCodeMutation } from '@/store/api/authApi';

interface PhoneLoginFormProps {
  onLogin: (phone: string, code: string) => Promise<void>;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

export const PhoneLoginForm: React.FC<PhoneLoginFormProps> = ({
  onLogin,
  showToast: showToastProp,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [showPicker, setShowPicker] = useState(false);
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [activateCode, setActivateCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [sendSmsCode, { isLoading: isSending }] = useSendSmsCodeMutation();

  // 使用父組件傳入的 showToast，如果沒有則使用本地實現（向後兼容）
  const showToast = showToastProp || ((message: string, type: 'success' | 'error' = 'success') => {
    console.warn('Toast not available:', message, type);
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = async () => {
    if (isSending) return;

    try {
      const mobile = `${selectedCountry.code}${phone}`;
      console.log('發送驗證碼到手機:', mobile);

      const result = await sendSmsCode({ mobile }).unwrap();

      if (result.ok) {
        showToast('驗證碼已發送', 'success');
        setCodeSent(true);
        setCountdown(60);
      }
    } catch (error: any) {
      console.error('發送驗證碼失敗:', error);
      const errorMessage = error?.data?.message || error?.data?.errors || error?.message || '發送失敗，請稍後再試';
      showToast(errorMessage, 'error');
    }
  };

  const handleLogin = () => {
    const mobile = `${selectedCountry.code}${phone}`;
    onLogin(mobile, verificationCode);
  };

  const isPhoneComplete = phone.length >= 10;

  return (
    <View style={styles.formContainer}>
      <View style={{ marginBottom: 40, marginTop: 10 }}>
        <Text style={styles.title}>手機驗證碼登入</Text>
      </View>
      {/* 國碼 + 手機號碼 */}
      <View style={styles.phoneRow}>
        <View style={styles.inputGroup}>
          <TouchableOpacity
            style={styles.countryCodeButton}
            onPress={() => setShowPicker(true)}>
            <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <TextInput
            style={styles.input}
            placeholder="請輸入手機號碼"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* 驗證碼輸入 */}
      <View style={styles.verificationCodeContainer}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 0 }]}>
          <TextInput
            style={{
              fontSize: 16,
              color: '#000000',
            }}
            placeholder="請輸入驗證碼"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            maxLength={8}
          />
        </View>
        <View style={styles.codeButtonContainer}>
          {codeSent && countdown > 0 ? (
            <Text style={styles.countdownText}>重新獲取驗證碼({countdown}s)</Text>
          ) : codeSent ? (
            <TouchableOpacity onPress={handleSendCode}>
              <Text style={styles.resendText}>重新獲取驗證碼</Text>
            </TouchableOpacity>
          ) : null}
          {/* 獲取驗證碼按鈕 */}
          {isPhoneComplete && !codeSent && (
            <TouchableOpacity style={styles.sendCodeButton} onPress={handleSendCode}>
              <Text style={styles.sendCodeText}>獲取驗證碼</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 提示文字 */}
      <Text style={styles.infoText}>未註冊的手機號驗證後會自動創建帳戶</Text>

      <View style={[styles.inputGroup, { marginRight: 0, marginBottom: 30 }]}>
        <TextInput
          style={styles.input}
          placeholder="開通碼（選填）"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={activateCode}
          onChangeText={setActivateCode}
          keyboardType="number-pad"
          maxLength={8}
        />
      </View>

      {/* 登入按鈕 */}
      <MyButton
        isActive={!!phone && !!verificationCode}
        title="登入"
        onPress={handleLogin}
      />

      {/* 國碼選擇器 */}
      <CountryCodePicker
        visible={showPicker}
        selectedCode={selectedCountry.code}
        onSelect={setSelectedCountry}
        onClose={() => setShowPicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingVertical: 8,
  },
  title: {
    color: '#000',
    fontSize: 20,
    fontWeight: '400',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#000000',
    marginRight: 4,
  },
  dropdownIcon: {
    fontSize: 10,
    color: '#000000',
  },
  inputGroup: {
    marginBottom: 10,
    marginRight: 10,
  },
  input: {
    height: 42,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    fontSize: 16,
    color: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  sendCodeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sendCodeText: {
    fontSize: 16,
    color: 'white',
  },
  verificationCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 4,
  },
  codeButtonContainer: {
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 16,
    padding: 7,
    color: 'rgba(0, 0, 0, 0.6)',
    marginLeft: 12,
  },
  resendText: {
    fontSize: 12,
    color: '#000000',
    marginLeft: 12,
    padding: 7,
  },
  infoText: {
    fontSize: 12,
    color: 'black',
    marginBottom: 24,
  },
});
