import { baseApi } from './baseApi';

// 請求和回應的類型定義
export interface MediaUploadInfoRequest {
  extname: string; // 圖片副檔名，如 'png', 'jpg', 'jpeg'
  date: string; // 日期格式 YYYY-MM-DD
}

export interface MediaUploadInfoResponse {
  url: string; // Google Cloud Storage 上傳 URL
  result_url: string; // 上傳完成後的完整 URL
  storage: string; // 儲存類型，如 'gcloud'
  name: string; // 檔案在 storage 中的名稱
  key: string; // 檔案的 key
  cdn_url: string; // CDN URL
}

// 擴展 baseApi 添加媒體上傳相關的 endpoints
export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 取得圖片上傳資訊
    getMediaUploadInfo: builder.query<
      MediaUploadInfoResponse,
      MediaUploadInfoRequest
    >({
      query: ({ extname, date }) => ({
        url: '/v4/notes/media_upload_info',
        method: 'GET',
        params: {
          extname,
          date,
        },
      }),
    }),
  }),
  overrideExisting: false,
});

// 導出 hooks 供組件使用
export const {
  useGetMediaUploadInfoQuery,
  useLazyGetMediaUploadInfoQuery,
} = mediaApi;
