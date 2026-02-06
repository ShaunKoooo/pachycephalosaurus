import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/authApi';
import type { RegisterMobileResponse } from '../api/authApi';

export interface User {
  id: string;
  name: string;
  phone?: string;
  avatar?: string;
  role?: 'coach' | 'client';
  first_name?: string;
  last_name?: string;
  nick_name?: string;
  avatar_thumbnail_url?: string;
}

export type LoginMethod = 'phone' | 'email';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  userRole: 'coach' | 'client' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginMethod: LoginMethod;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  userRole: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginMethod: 'phone',
};

// Storage keys
const STORAGE_KEYS = {
  TOKEN: '@auth:token',
  REFRESH_TOKEN: '@auth:refreshToken',
  USER: '@auth:user',
  ROLE: '@auth:role',
};

// 檢查登入狀態
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const [token, userData, userRole] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.ROLE),
      ]);

      if (token && userData) {
        return {
          token,
          user: JSON.parse(userData),
          userRole: (userRole as 'coach' | 'client') || 'client',
        };
      }
      return rejectWithValue('No auth data');
    } catch (error) {
      return rejectWithValue('Failed to check auth status');
    }
  }
);

// 手機驗證碼登入 (cofitapp 專用)
export const loginWithPhone = createAsyncThunk(
  'auth/loginWithPhone',
  async (
    { phone, verificationCode }: { phone: string; verificationCode: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // 調用真實 API
      const result = await dispatch(
        authApi.endpoints.registerMobileWithCode.initiate({
          mobile: phone,
          code: verificationCode,
        })
      ).unwrap();

      // 構建用戶資料
      const userData: User = {
        id: result.pq_login_info.data.cofit_uid,
        name: result.nick_name || result.last_name || result.first_name,
        phone: result.pq_login_info.data.mobile,
        role: 'client',
        first_name: result.first_name,
        last_name: result.last_name,
        nick_name: result.nick_name,
        avatar_thumbnail_url: result.avatar_thumbnail_url,
      };

      // 儲存到 AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, result.access_token),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEYS.ROLE, 'client'),
      ]);

      return {
        token: result.access_token,
        user: userData,
        userRole: 'client' as const,
      };
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.data?.errors || error?.message || '登入失敗';
      return rejectWithValue(errorMessage);
    }
  }
);

// Email 登入
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async (
    { email, password }: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // 調用真實 API
      const result = await dispatch(
        authApi.endpoints.signInWithEmail.initiate({
          email,
          password,
        })
      ).unwrap();

      // 構建用戶資料
      const userData: User = {
        id: result.nick_name, // Email 登入沒有 cofit_uid，暫時用 nick_name
        name: result.nick_name || result.last_name || result.first_name || '',
        role: 'client',
        first_name: result.first_name || undefined,
        last_name: result.last_name,
        nick_name: result.nick_name,
        avatar_thumbnail_url: result.avatar_thumbnail_url,
      };

      // 儲存到 AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, result.access_token),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEYS.ROLE, 'client'),
      ]);

      return {
        token: result.access_token,
        user: userData,
        userRole: 'client' as const,
      };
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.data?.errors || error?.message || '登入失敗';
      return rejectWithValue(errorMessage);
    }
  }
);

// 登出
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // 清除 AsyncStorage
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.ROLE),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);

      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || '登出失敗');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken?: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoginMethod: (state, action: PayloadAction<LoginMethod>) => {
      state.loginMethod = action.payload;
    },
    logout: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // 檢查登入狀態
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.userRole = action.payload.userRole;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });

    // 手機驗證碼登入
    builder
      .addCase(loginWithPhone.pending, (state) => {
        // 不設置 isLoading，避免 RootNavigator 重新渲染
        state.error = null;
      })
      .addCase(loginWithPhone.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.userRole = action.payload.userRole;
        state.error = null;
      })
      .addCase(loginWithPhone.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Email 登入
    builder
      .addCase(loginWithEmail.pending, (state) => {
        // 不設置 isLoading，避免 RootNavigator 重新渲染
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.userRole = action.payload.userRole;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // 登出
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
      })
      .addCase(logoutAsync.fulfilled, () => {
        return initialState;
      });
  },
});

export const { setCredentials, clearError, setLoginMethod, logout } = authSlice.actions;
export default authSlice.reducer;
