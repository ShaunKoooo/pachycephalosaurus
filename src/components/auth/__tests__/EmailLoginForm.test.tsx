import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { EmailLoginForm } from '../EmailLoginForm';
import authReducer from '@/store/slices/authSlice';

// Mock authApi
jest.mock('@/store/api/authApi', () => ({
  authApi: {
    endpoints: {
      signInWithEmail: {
        initiate: jest.fn(),
      },
    },
  },
}));

describe('EmailLoginForm', () => {
  let store: ReturnType<typeof configureStore>;
  let mockShowToast: jest.Mock;
  let mockOnForgotPassword: jest.Mock;
  let mockOnRegister: jest.Mock;

  beforeEach(() => {
    // 建立測試用的 store
    store = configureStore({
      reducer: { auth: authReducer },
    });

    // 建立 mock 函數
    mockShowToast = jest.fn();
    mockOnForgotPassword = jest.fn();
    mockOnRegister = jest.fn();

    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <EmailLoginForm
          showToast={mockShowToast}
          onForgotPassword={mockOnForgotPassword}
          onRegister={mockOnRegister}
          {...props}
        />
      </Provider>
    );
  };

  describe('渲染測試', () => {
    it('應該渲染所有必要元素', () => {
      const { getByPlaceholderText, getByText } = renderComponent();

      // 驗證表單元素存在
      expect(getByPlaceholderText('auth:emailLogin.emailPlaceholder')).toBeTruthy();
      expect(getByPlaceholderText('auth:emailLogin.passwordPlaceholder')).toBeTruthy();
      expect(getByText('common:button.signIn')).toBeTruthy();
    });

    it('應該顯示標題', () => {
      const { getByText } = renderComponent();
      expect(getByText('auth:emailLogin.title')).toBeTruthy();
    });

    it('應該顯示忘記密碼連結', () => {
      const { getByText } = renderComponent();
      expect(getByText('auth:emailLogin.forgotPassword')).toBeTruthy();
    });

    it('應該顯示註冊提示', () => {
      const { getByText } = renderComponent();
      expect(getByText('auth:emailLogin.noAccount')).toBeTruthy();
      expect(getByText('common:button.signUp')).toBeTruthy();
    });
  });

  describe('表單互動測試', () => {
    it('應該能夠輸入 email', () => {
      const { getByPlaceholderText } = renderComponent();
      const emailInput = getByPlaceholderText('auth:emailLogin.emailPlaceholder');

      fireEvent.changeText(emailInput, 'test@example.com');

      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('應該能夠輸入密碼', () => {
      const { getByPlaceholderText } = renderComponent();
      const passwordInput = getByPlaceholderText('auth:emailLogin.passwordPlaceholder');

      fireEvent.changeText(passwordInput, 'password123');

      expect(passwordInput.props.value).toBe('password123');
    });

    it('密碼欄位預設應該隱藏', () => {
      const { getByPlaceholderText } = renderComponent();
      const passwordInput = getByPlaceholderText('auth:emailLogin.passwordPlaceholder');

      expect(passwordInput.props.secureTextEntry).toBe(true);
    });

    it('點擊眼睛圖標應該切換密碼可見性', () => {
      const { getByPlaceholderText, UNSAFE_getByType } = renderComponent();
      const passwordInput = getByPlaceholderText('auth:emailLogin.passwordPlaceholder');

      // 初始狀態：密碼隱藏
      expect(passwordInput.props.secureTextEntry).toBe(true);

      // 找到 TouchableOpacity（眼睛圖標的父元素）
      const { TouchableOpacity } = require('react-native');
      const eyeButtons = UNSAFE_getByType(TouchableOpacity);

      // 點擊切換
      fireEvent.press(eyeButtons);

      // 驗證密碼現在可見
      expect(passwordInput.props.secureTextEntry).toBe(false);
    });
  });

  describe('表單驗證測試', () => {
    it('當 email 和密碼都為空時，點擊登入應該顯示錯誤', async () => {
      const { getByText } = renderComponent();
      const loginButton = getByText('common:button.signIn');

      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          'auth:emailLogin.requiredFields',
          'error'
        );
      });
    });

    it('當只有 email 時，點擊登入應該顯示錯誤', async () => {
      const { getByPlaceholderText, getByText } = renderComponent();
      const emailInput = getByPlaceholderText('auth:emailLogin.emailPlaceholder');
      const loginButton = getByText('common:button.signIn');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          'auth:emailLogin.requiredFields',
          'error'
        );
      });
    });

    it('當只有密碼時，點擊登入應該顯示錯誤', async () => {
      const { getByPlaceholderText, getByText } = renderComponent();
      const passwordInput = getByPlaceholderText('auth:emailLogin.passwordPlaceholder');
      const loginButton = getByText('common:button.signIn');

      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          'auth:emailLogin.requiredFields',
          'error'
        );
      });
    });
  });

  describe('登入流程測試', () => {
    it('成功登入時應該調用 API', async () => {
      const mockInitiate = jest.fn().mockReturnValue({
        unwrap: jest.fn().mockResolvedValue({
          access_token: 'test-token',
          nick_name: 'testuser',
          last_name: 'User',
          first_name: 'Test',
          avatar_thumbnail_url: 'https://example.com/avatar.jpg',
          terms_of_service_agreed: true,
        }),
      });

      const { authApi } = require('@/store/api/authApi');
      authApi.endpoints.signInWithEmail.initiate = mockInitiate;

      const { getByPlaceholderText, getByText } = renderComponent();

      const emailInput = getByPlaceholderText('auth:emailLogin.emailPlaceholder');
      const passwordInput = getByPlaceholderText('auth:emailLogin.passwordPlaceholder');
      const loginButton = getByText('common:button.signIn');

      // 輸入資料
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      // 點擊登入
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockInitiate).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      // 成功登入不應該顯示 toast
      expect(mockShowToast).not.toHaveBeenCalled();
    });

    it('登入失敗時應該顯示錯誤訊息', async () => {
      const mockInitiate = jest.fn().mockReturnValue({
        unwrap: jest.fn().mockRejectedValue({
          message: '帳號或密碼錯誤',
        }),
      });

      const { authApi } = require('@/store/api/authApi');
      authApi.endpoints.signInWithEmail.initiate = mockInitiate;

      const { getByPlaceholderText, getByText } = renderComponent();

      const emailInput = getByPlaceholderText('auth:emailLogin.emailPlaceholder');
      const passwordInput = getByPlaceholderText('auth:emailLogin.passwordPlaceholder');
      const loginButton = getByText('common:button.signIn');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'wrong-password');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('帳號或密碼錯誤', 'error');
      });
    });

    it('登入期間應該顯示載入狀態', async () => {
      let resolveLogin: (value: any) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });

      const mockInitiate = jest.fn().mockReturnValue({
        unwrap: jest.fn(() => loginPromise),
      });

      const { authApi } = require('@/store/api/authApi');
      authApi.endpoints.signInWithEmail.initiate = mockInitiate;

      const { getByPlaceholderText, getByText, queryByText } = renderComponent();

      const emailInput = getByPlaceholderText('auth:emailLogin.emailPlaceholder');
      const passwordInput = getByPlaceholderText('auth:emailLogin.passwordPlaceholder');
      const loginButton = getByText('common:button.signIn');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      // 登入期間應該顯示「登入中...」
      await waitFor(() => {
        expect(queryByText('common:button.signingIn')).toBeTruthy();
      });

      // 完成登入
      resolveLogin!({
        access_token: 'test-token',
        nick_name: 'testuser',
        last_name: 'User',
      });

      // 登入完成後應該恢復正常按鈕文字
      await waitFor(() => {
        expect(queryByText('common:button.signIn')).toBeTruthy();
      });
    });
  });

  describe('其他功能測試', () => {
    it('點擊忘記密碼應該調用回調函數', () => {
      const { getByText } = renderComponent();
      const forgotPasswordButton = getByText('auth:emailLogin.forgotPassword');

      fireEvent.press(forgotPasswordButton);

      expect(mockOnForgotPassword).toHaveBeenCalledTimes(1);
    });

    it('點擊註冊應該調用回調函數', () => {
      const { getByText } = renderComponent();
      const registerButton = getByText('common:button.signUp');

      fireEvent.press(registerButton);

      expect(mockOnRegister).toHaveBeenCalledTimes(1);
    });

    it('如果沒有提供 showToast，應該使用預設實現', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const { getByText } = render(
        <Provider store={store}>
          <EmailLoginForm />
        </Provider>
      );

      const loginButton = getByText('common:button.signIn');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Toast not available:',
          'auth:emailLogin.requiredFields',
          'error'
        );
      });

      consoleWarnSpy.mockRestore();
    });
  });
});
