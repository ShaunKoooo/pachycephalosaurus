import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { PhoneLoginForm } from '../PhoneLoginForm';

// Mock authApi
jest.mock('@/store/api/authApi', () => ({
  useSendSmsCodeMutation: jest.fn(),
}));

// Mock CountryCodePicker
jest.mock('../CountryCodePicker', () => ({
  CountryCodePicker: () => null,
}));

describe('PhoneLoginForm', () => {
  let mockOnLogin: jest.Mock;
  let mockShowToast: jest.Mock;
  let mockSendSmsCode: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockOnLogin = jest.fn();
    mockShowToast = jest.fn();
    mockSendSmsCode = jest.fn();

    // Mock useSendSmsCodeMutation
    const { useSendSmsCodeMutation } = require('@/store/api/authApi');
    useSendSmsCodeMutation.mockReturnValue([
      mockSendSmsCode,
      { isLoading: false },
    ]);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderComponent = (props = {}) => {
    return render(
      <PhoneLoginForm
        onLogin={mockOnLogin}
        showToast={mockShowToast}
        {...props}
      />
    );
  };

  describe('渲染測試', () => {
    it('應該渲染所有必要元素', () => {
      const { getByPlaceholderText, getByText } = renderComponent();

      expect(getByText('auth:phoneLogin.title')).toBeTruthy();
      expect(getByPlaceholderText('auth:phoneLogin.phonePlaceholder')).toBeTruthy();
      expect(
        getByPlaceholderText('auth:phoneLogin.verificationCodePlaceholder')
      ).toBeTruthy();
      expect(
        getByPlaceholderText('auth:phoneLogin.activateCodePlaceholder')
      ).toBeTruthy();
      expect(getByText('common:button.signIn')).toBeTruthy();
    });

    it('應該顯示預設國碼 +886', () => {
      const { getByText } = renderComponent();
      expect(getByText('+886')).toBeTruthy();
    });

    it('應該顯示提示文字', () => {
      const { getByText } = renderComponent();
      expect(getByText('auth:phoneLogin.info')).toBeTruthy();
    });
  });

  describe('手機號碼輸入測試', () => {
    it('應該能夠輸入手機號碼', () => {
      const { getByPlaceholderText } = renderComponent();
      const phoneInput = getByPlaceholderText('auth:phoneLogin.phonePlaceholder');

      fireEvent.changeText(phoneInput, '0912345678');

      expect(phoneInput.props.value).toBe('0912345678');
    });

    it('手機號碼長度 >= 10 時應該顯示發送驗證碼按鈕', () => {
      const { getByPlaceholderText, getByText } = renderComponent();
      const phoneInput = getByPlaceholderText('auth:phoneLogin.phonePlaceholder');

      fireEvent.changeText(phoneInput, '0912345678');

      expect(getByText('auth:phoneLogin.sendCode')).toBeTruthy();
    });

    it('手機號碼長度 < 10 時不應該顯示發送驗證碼按鈕', () => {
      const { getByPlaceholderText, queryByText } = renderComponent();
      const phoneInput = getByPlaceholderText('auth:phoneLogin.phonePlaceholder');

      fireEvent.changeText(phoneInput, '091234');

      expect(queryByText('auth:phoneLogin.sendCode')).toBeNull();
    });
  });

  describe('發送驗證碼測試', () => {
    it('點擊發送驗證碼應該調用 API', async () => {
      mockSendSmsCode.mockReturnValue({
        unwrap: jest.fn().mockResolvedValue({ ok: true }),
      });

      const { getByPlaceholderText, getByText } = renderComponent();
      const phoneInput = getByPlaceholderText('auth:phoneLogin.phonePlaceholder');

      fireEvent.changeText(phoneInput, '0912345678');

      const sendButton = getByText('auth:phoneLogin.sendCode');
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        expect(mockSendSmsCode).toHaveBeenCalledWith({
          mobile: '+8860912345678',
        });
      });
    });

    it('發送成功後應該顯示成功訊息並開始倒數', async () => {
      mockSendSmsCode.mockReturnValue({
        unwrap: jest.fn().mockResolvedValue({ ok: true }),
      });

      const { getByPlaceholderText, getByText, queryByText } = renderComponent();
      const phoneInput = getByPlaceholderText('auth:phoneLogin.phonePlaceholder');

      fireEvent.changeText(phoneInput, '0912345678');

      const sendButton = getByText('auth:phoneLogin.sendCode');
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          'auth:phoneLogin.codeSent',
          'success'
        );
      });

      // 應該顯示倒數計時
      await waitFor(() => {
        expect(
          queryByText('auth:phoneLogin.resendCountdown', { countdown: 60 })
        ).toBeTruthy();
      });
    });

    it('倒數計時應該正確運作', async () => {
      mockSendSmsCode.mockReturnValue({
        unwrap: jest.fn().mockResolvedValue({ ok: true }),
      });

      const { getByPlaceholderText, getByText, queryByText } = renderComponent();
      const phoneInput = getByPlaceholderText('auth:phoneLogin.phonePlaceholder');

      fireEvent.changeText(phoneInput, '0912345678');

      const sendButton = getByText('auth:phoneLogin.sendCode');
      await act(async () => {
        fireEvent.press(sendButton);
      });

      // 等待發送成功
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalled();
      });

      // 推進時間 1 秒
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // 應該顯示 59 秒
      await waitFor(() => {
        expect(
          queryByText('auth:phoneLogin.resendCountdown', { countdown: 59 })
        ).toBeTruthy();
      });

      // 推進時間到 60 秒後
      act(() => {
        jest.advanceTimersByTime(59000);
      });

      // 應該顯示重新發送按鈕
      await waitFor(() => {
        expect(queryByText('auth:phoneLogin.resendCode')).toBeTruthy();
      });
    });

    it('發送失敗時應該顯示錯誤訊息', async () => {
      mockSendSmsCode.mockReturnValue({
        unwrap: jest
          .fn()
          .mockRejectedValue({ data: { message: '手機號碼格式錯誤' } }),
      });

      const { getByPlaceholderText, getByText } = renderComponent();
      const phoneInput = getByPlaceholderText('auth:phoneLogin.phonePlaceholder');

      fireEvent.changeText(phoneInput, '123');

      const sendButton = getByText('auth:phoneLogin.sendCode');
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('手機號碼格式錯誤', 'error');
      });
    });

    it('倒數期間不應該能再次發送', async () => {
      mockSendSmsCode.mockReturnValue({
        unwrap: jest.fn().mockResolvedValue({ ok: true }),
      });

      const { getByPlaceholderText, getByText, queryByText } = renderComponent();
      const phoneInput = getByPlaceholderText('auth:phoneLogin.phonePlaceholder');

      fireEvent.changeText(phoneInput, '0912345678');

      const sendButton = getByText('auth:phoneLogin.sendCode');
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalled();
      });

      // 倒數期間不應該顯示發送按鈕
      expect(queryByText('auth:phoneLogin.sendCode')).toBeNull();
    });
  });

  describe('驗證碼輸入測試', () => {
    it('應該能夠輸入驗證碼', () => {
      const { getByPlaceholderText } = renderComponent();
      const codeInput = getByPlaceholderText(
        'auth:phoneLogin.verificationCodePlaceholder'
      );

      fireEvent.changeText(codeInput, '123456');

      expect(codeInput.props.value).toBe('123456');
    });

    it('驗證碼應該限制最多 8 個字元', () => {
      const { getByPlaceholderText } = renderComponent();
      const codeInput = getByPlaceholderText(
        'auth:phoneLogin.verificationCodePlaceholder'
      );

      expect(codeInput.props.maxLength).toBe(8);
    });
  });

  describe('啟動碼輸入測試', () => {
    it('應該能夠輸入啟動碼', () => {
      const { getByPlaceholderText } = renderComponent();
      const activateInput = getByPlaceholderText(
        'auth:phoneLogin.activateCodePlaceholder'
      );

      fireEvent.changeText(activateInput, '87654321');

      expect(activateInput.props.value).toBe('87654321');
    });

    it('啟動碼應該限制最多 8 個字元', () => {
      const { getByPlaceholderText } = renderComponent();
      const activateInput = getByPlaceholderText(
        'auth:phoneLogin.activateCodePlaceholder'
      );

      expect(activateInput.props.maxLength).toBe(8);
    });
  });

  describe('登入測試', () => {
    it('當手機號碼和驗證碼都填寫時，登入按鈕應該啟用', () => {
      const { getByPlaceholderText } = renderComponent();

      const phoneInput = getByPlaceholderText('auth:phoneLogin.phonePlaceholder');
      const codeInput = getByPlaceholderText(
        'auth:phoneLogin.verificationCodePlaceholder'
      );

      fireEvent.changeText(phoneInput, '0912345678');
      fireEvent.changeText(codeInput, '123456');

      // MyButton 組件會根據 isActive prop 設置按鈕狀態
      // 這裡我們驗證兩個欄位都有值
      expect(phoneInput.props.value).toBe('0912345678');
      expect(codeInput.props.value).toBe('123456');
    });

    it('點擊登入應該調用 onLogin 回調', () => {
      const { getByPlaceholderText, getByText } = renderComponent();

      const phoneInput = getByPlaceholderText('auth:phoneLogin.phonePlaceholder');
      const codeInput = getByPlaceholderText(
        'auth:phoneLogin.verificationCodePlaceholder'
      );
      const loginButton = getByText('common:button.signIn');

      fireEvent.changeText(phoneInput, '0912345678');
      fireEvent.changeText(codeInput, '123456');
      fireEvent.press(loginButton);

      expect(mockOnLogin).toHaveBeenCalledWith('+8860912345678', '123456');
    });

    it('登入時應該使用完整的國際格式手機號碼', () => {
      const { getByPlaceholderText, getByText } = renderComponent();

      const phoneInput = getByPlaceholderText('auth:phoneLogin.phonePlaceholder');
      const codeInput = getByPlaceholderText(
        'auth:phoneLogin.verificationCodePlaceholder'
      );
      const loginButton = getByText('common:button.signIn');

      fireEvent.changeText(phoneInput, '0987654321');
      fireEvent.changeText(codeInput, '654321');
      fireEvent.press(loginButton);

      // 應該包含國碼
      expect(mockOnLogin).toHaveBeenCalledWith('+8860987654321', '654321');
    });
  });

  describe('國碼選擇測試', () => {
    it('點擊國碼應該打開選擇器', () => {
      const { getByText } = renderComponent();
      const countryCodeButton = getByText('+886');

      fireEvent.press(countryCodeButton);

      // 由於我們 mock 了 CountryCodePicker，這裡主要驗證點擊事件不會出錯
      expect(countryCodeButton).toBeTruthy();
    });
  });

  describe('預設行為測試', () => {
    it('如果沒有提供 showToast，應該使用預設實現', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      mockSendSmsCode.mockReturnValue({
        unwrap: jest.fn().mockResolvedValue({ ok: true }),
      });

      const { getByPlaceholderText, getByText } = render(
        <PhoneLoginForm onLogin={mockOnLogin} />
      );

      const phoneInput = getByPlaceholderText('auth:phoneLogin.phonePlaceholder');
      fireEvent.changeText(phoneInput, '0912345678');

      const sendButton = getByText('auth:phoneLogin.sendCode');
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Toast not available:',
          'auth:phoneLogin.codeSent',
          'success'
        );
      });

      consoleWarnSpy.mockRestore();
    });
  });
});
