import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer, {
  setCredentials,
  setLoginMethod,
  logout,
  checkAuthStatus,
  logoutAsync,
} from '../authSlice';
import type { User } from '../authSlice';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

describe('authSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初始狀態', () => {
    it('應該返回正確的初始狀態', () => {
      const state = authReducer(undefined, { type: 'unknown' });

      expect(state).toEqual({
        user: null,
        token: null,
        refreshToken: null,
        userRole: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        loginMethod: 'phone',
      });
    });
  });

  describe('reducers', () => {
    it('應該處理 setLoginMethod', () => {
      const initialState = authReducer(undefined, { type: 'unknown' });
      const state = authReducer(initialState, setLoginMethod('email'));

      expect(state.loginMethod).toBe('email');
    });

    it('應該從 phone 切換到 email', () => {
      const initialState = authReducer(undefined, { type: 'unknown' });
      expect(initialState.loginMethod).toBe('phone');

      const state = authReducer(initialState, setLoginMethod('email'));
      expect(state.loginMethod).toBe('email');
    });

    it('應該處理 setCredentials', () => {
      const initialState = authReducer(undefined, { type: 'unknown' });
      const user: User = {
        id: 'test-id',
        name: 'Test User',
        phone: '+886912345678',
      };

      const state = authReducer(
        initialState,
        setCredentials({
          user,
          token: 'test-token',
          refreshToken: 'refresh-token',
        })
      );

      expect(state.user).toEqual(user);
      expect(state.token).toBe('test-token');
      expect(state.refreshToken).toBe('refresh-token');
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('應該處理 logout', () => {
      const authenticatedState = {
        user: { id: '1', name: 'Test' } as User,
        token: 'test-token',
        refreshToken: 'refresh-token',
        userRole: 'client' as const,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginMethod: 'phone' as const,
      };

      const state = authReducer(authenticatedState, logout());

      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.userRole).toBeNull();
    });
  });

  describe('checkAuthStatus', () => {
    it('成功時應該恢復登入狀態', async () => {
      const mockToken = 'stored-token';
      const mockUser: User = {
        id: 'user-123',
        name: 'Stored User',
      };

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@auth:token') return Promise.resolve(mockToken);
        if (key === '@auth:user') return Promise.resolve(JSON.stringify(mockUser));
        if (key === '@auth:role') return Promise.resolve('client');
        return Promise.resolve(null);
      });

      const store = configureStore({
        reducer: { auth: authReducer },
      });

      await store.dispatch(checkAuthStatus());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe(mockToken);
      expect(state.user).toEqual(mockUser);
      expect(state.userRole).toBe('client');
    });

    it('沒有儲存的資料時應該失敗', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const store = configureStore({
        reducer: { auth: authReducer },
      });

      await store.dispatch(checkAuthStatus());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('logoutAsync', () => {
    it('應該清除 AsyncStorage 並重置狀態', async () => {
      const authenticatedState = {
        user: { id: '1', name: 'Test' } as User,
        token: 'test-token',
        refreshToken: 'refresh-token',
        userRole: 'client' as const,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginMethod: 'phone' as const,
      };

      const store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: { auth: authenticatedState },
      });

      await store.dispatch(logoutAsync());

      // 驗證 AsyncStorage 清除
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@auth:token');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@auth:user');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@auth:role');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@auth:refreshToken');

      // 驗證狀態重置
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });
  });
});
