import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '../index';
import { logoutAsync } from '../slices/authSlice';
import Config from 'react-native-config';

// 建立 base query
const baseQuery = fetchBaseQuery({
  baseUrl: Config.API_URL,
  prepareHeaders: (headers, { getState }) => {
    // 自動添加 token 到 headers
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// 包裝 base query 處理 401 錯誤
const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // 如果收到 401 錯誤，自動登出
  // 但排除登入相關的 API（登入失敗時的 401 是正常的，不應該觸發 logout）
  if (result.error && result.error.status === 401) {
    const url = typeof args === 'string' ? args : args.url;
    const isLoginRequest = url.includes('/sign_in') ||
                          url.includes('/register_mobile_with_code') ||
                          url.includes('/mobile_sms_code');

    // 只有非登入請求的 401 才執行 logout（表示 token 過期或無效）
    if (!isLoginRequest) {
      api.dispatch(logoutAsync());
    }
  }

  return result;
};

// Base API 配置
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  // Tag types for cache invalidation
  tagTypes: ['User', 'Chat', 'Nutrition'],
  endpoints: () => ({}), // Endpoints 會在各自的 API 檔案中定義
});
