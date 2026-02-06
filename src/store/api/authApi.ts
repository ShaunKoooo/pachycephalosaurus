import { baseApi } from './baseApi';
import Config from 'react-native-config';

// 請求和回應的類型定義
export interface SendSmsCodeRequest {
  app_name: string;
  mobile: string;
  type: string;
  t: number;
}

export interface SendSmsCodeResponse {
  ok: boolean;
}

export interface RegisterMobileRequest {
  app_name: string;
  mobile: string;
  code: string;
}

export interface PQLoginInfo {
  code: string;
  message: string;
  data: {
    level: string;
    cofit_uid: string;
    level_id: number;
    mobile: string;
    id: number;
  };
}

export interface RegisterMobileResponse {
  access_token: string;
  first_name: string;
  last_name: string;
  nick_name: string;
  avatar_thumbnail_url: string;
  terms_of_service_agreed: boolean;
  password_set: boolean;
  pq_login_info: PQLoginInfo;
}

// Email 登入的請求和回應類型
export interface SignInWithEmailRequest {
  app_name: string;
  source: string;
  email: string;
  password: string;
}

export interface SignInWithEmailResponse {
  access_token: string;
  first_name: string | null;
  last_name: string;
  nick_name: string;
  avatar_thumbnail_url: string;
  terms_of_service_agreed: boolean;
}

// 取得 app_name，根據不同環境
const getAppName = (): string => {
  const appType = Config.APP_TYPE;

  // 根據不同環境返回對應的 app_name
  switch (appType) {
    case 'cofitstaging':
      return 'cofit_app'; // staging 環境使用 cofit_app
    case 'cofitapp':
      return 'cofit_app'; // production 環境使用 cofit_app
    case 'cofitpro':
      return 'cofit_pro'; // pro 版本
    default:
      return 'cofit_app';
  }
};

// 取得 API 基礎路徑（cofitpro 用 users，其他用 clients）
const getApiBasePath = (): string => {
  return Config.APP_TYPE === 'cofitpro' ? 'users' : 'clients';
};

// 擴展 baseApi 添加認證相關的 endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 發送手機驗證碼
    sendSmsCode: builder.mutation<
      SendSmsCodeResponse,
      { mobile: string }
    >({
      query: ({ mobile }) => ({
        url: '/v4/clients/mobile_sms_code',
        method: 'POST',
        body: {
          app_name: getAppName(),
          mobile,
          type: 'mobile_login_verify_code',
          t: 1,
        },
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': 'Bearer',
          'token': '',
        },
      }),
    }),

    // 手機驗證碼登入/註冊
    registerMobileWithCode: builder.mutation<
      RegisterMobileResponse,
      { mobile: string; code: string }
    >({
      query: ({ mobile, code }) => ({
        url: '/v4/clients/register_mobile_with_code',
        method: 'POST',
        body: {
          app_name: getAppName(),
          mobile,
          code,
        },
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': 'Bearer',
          'token': '',
        },
      }),
      // 登入成功後標記 User cache 為失效，需要重新獲取
      invalidatesTags: ['User'],
    }),

    // Email 登入
    signInWithEmail: builder.mutation<
      SignInWithEmailResponse,
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: `/v4/${getApiBasePath()}/sign_in`,
        method: 'POST',
        body: {
          app_name: getAppName(),
          source: 'cofit',
          email,
          password,
        },
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': 'Bearer',
          'token': '',
        },
      }),
      // 登入成功後標記 User cache 為失效，需要重新獲取
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

// 導出 hooks 供組件使用
export const {
  useSendSmsCodeMutation,
  useRegisterMobileWithCodeMutation,
  useSignInWithEmailMutation
} = authApi;
