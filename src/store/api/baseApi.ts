import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import Config from 'react-native-config';

// Base API 配置
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
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
  }),
  // Tag types for cache invalidation
  tagTypes: ['User', 'Chat', 'Nutrition'],
  endpoints: () => ({}), // Endpoints 會在各自的 API 檔案中定義
});
