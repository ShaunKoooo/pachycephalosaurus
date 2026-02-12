import { Asset } from 'react-native-image-picker';
import type { MediaUploadInfoResponse } from '../store/api/mediaApi';

/**
 * 從檔案路徑取得副檔名（不含點）
 */
export const getFileExtension = (uri: string): string => {
  const match = uri.match(/\.([^./?#]+)(?:[?#]|$)/i);
  return match ? match[1].toLowerCase() : 'jpg';
};

/**
 * 格式化日期為 YYYY-MM-DD 格式
 */
export const formatDateForUpload = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 上傳單張圖片到 Google Cloud Storage
 */
export const uploadImageToGCS = async (
  uploadUrl: string,
  imageAsset: Asset,
): Promise<boolean> => {
  try {
    if (!imageAsset.uri) {
      throw new Error('Image URI is missing');
    }

    // 準備上傳的資料
    const formData = new FormData();
    formData.append('file', {
      uri: imageAsset.uri,
      type: imageAsset.type || 'image/jpeg',
      name: imageAsset.fileName || 'image.jpg',
    } as any);

    // 上傳到 Google Cloud Storage
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': imageAsset.type || 'image/jpeg',
      },
      body: formData,
    });

    return response.ok;
  } catch (error) {
    console.error('Error uploading image to GCS:', error);
    return false;
  }
};

/**
 * 處理單張圖片的完整上傳流程
 * @param imageAsset - 從 react-native-image-picker 選擇的圖片
 * @param getUploadInfo - 取得上傳資訊的函數（來自 API）
 * @returns 上傳成功後的 CDN URL，失敗則返回 null
 */
export const uploadSingleImage = async (
  imageAsset: Asset,
  getUploadInfo: (params: {
    extname: string;
    date: string;
  }) => Promise<MediaUploadInfoResponse>,
): Promise<string | null> => {
  try {
    if (!imageAsset.uri) {
      console.error('Image URI is missing');
      return null;
    }

    // 1. 取得副檔名和日期
    const extname = getFileExtension(imageAsset.uri);
    const date = formatDateForUpload();

    // 2. 取得上傳資訊
    const uploadInfo = await getUploadInfo({ extname, date });

    // 3. 上傳圖片到 GCS
    const success = await uploadImageToGCS(uploadInfo.url, imageAsset);

    if (!success) {
      console.error('Failed to upload image to GCS');
      return null;
    }

    // 4. 返回 CDN URL
    return uploadInfo.cdn_url;
  } catch (error) {
    console.error('Error in uploadSingleImage:', error);
    return null;
  }
};

/**
 * 批次上傳多張圖片
 * @param imageAssets - 從 react-native-image-picker 選擇的圖片陣列
 * @param getUploadInfo - 取得上傳資訊的函數（來自 API）
 * @param onProgress - 進度回調（可選）
 * @returns 上傳成功的 CDN URL 陣列
 */
export const uploadMultipleImages = async (
  imageAssets: Asset[],
  getUploadInfo: (params: {
    extname: string;
    date: string;
  }) => Promise<MediaUploadInfoResponse>,
  onProgress?: (completed: number, total: number) => void,
): Promise<string[]> => {
  const uploadedUrls: string[] = [];

  for (let i = 0; i < imageAssets.length; i++) {
    const imageAsset = imageAssets[i];
    const cdnUrl = await uploadSingleImage(imageAsset, getUploadInfo);

    if (cdnUrl) {
      uploadedUrls.push(cdnUrl);
    }

    // 呼叫進度回調
    if (onProgress) {
      onProgress(i + 1, imageAssets.length);
    }
  }

  return uploadedUrls;
};
