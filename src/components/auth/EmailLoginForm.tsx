import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '@/theme';
import { MyButton, FontelloIcon } from '@/components';

interface EmailLoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export const EmailLoginForm: React.FC<EmailLoginFormProps> = ({
  onLogin,
  onForgotPassword,
  onRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    onLogin(email, password);
  };

  return (
    <View style={styles.formContainer}>
      <View style={{ marginBottom: 40, marginTop: 10 }}>
        <Text style={styles.title}>帳密登入</Text>
      </View>

      {/* Email 輸入 */}
      <View style={styles.inputRow}>
        <Text style={styles.label}>帳號</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="請輸入 Email"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>

      {/* 密碼輸入 */}
      <View style={styles.inputRow}>
        <Text style={styles.label}>密碼</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="請輸入密碼"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <FontelloIcon
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color="rgba(0, 0, 0, 0.4)"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 登入按鈕 */}
      <MyButton
        isActive={!!email && !!password}
        title="登入"
        onPress={handleLogin}
      />

      {/* 忘記密碼 */}
      {onForgotPassword && (
        <TouchableOpacity onPress={onForgotPassword} style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>忘記密碼？</Text>
        </TouchableOpacity>
      )}

      {/* 註冊提示 */}
      {(
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>還沒有帳號？</Text>
          <TouchableOpacity onPress={onRegister}>
            <Text style={styles.registerLink}>註冊</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
  },
  title: {
    color: '#000',
    fontSize: 20,
    fontWeight: '400',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
    marginRight: 10,
  },
  inputContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  passwordContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  input: {
    flex: 1,
    height: 42,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  eyeButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: 'black',
    fontSize: 18,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: 'black',
    fontSize: 18,
    marginRight: 4,
  },
  registerLink: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '500',
  },
});
