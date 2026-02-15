import { Asset } from 'react-native-image-picker';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
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
    console.log('[uploadImageToGCS] Starting GCS upload');
    console.log('[uploadImageToGCS] Image asset:', {
      uri: imageAsset.uri,
      type: imageAsset.type,
      fileName: imageAsset.fileName,
      fileSize: imageAsset.fileSize,
    });

    if (!imageAsset.uri) {
      throw new Error('Image URI is missing');
    }

    const filePath = imageAsset.uri;
    const contentType = imageAsset.type || 'image/jpeg';

    console.log('[uploadImageToGCS] File path:', filePath);

    // 如果是 iOS ph:// URI，使用 CameraRoll 取得實際檔案路徑
    if (filePath.toLowerCase().startsWith('ph://')) {
      console.log('[uploadImageToGCS] Detected iOS photo library URI, using CameraRoll...');

      // 使用 CameraRoll.iosGetImageDataById 取得實際檔案路徑
      const imageData = await CameraRoll.iosGetImageDataById(filePath);
      const realFilePath = imageData?.node?.image?.filepath;
      console.log('[uploadImageToGCS] Got filepath from CameraRoll:', realFilePath);

      if (!realFilePath) {
        console.error('[uploadImageToGCS] Unable to get file path from ph:// URI');
        throw new Error('Unable to get file path from ph:// URI');
      }

      console.log('[uploadImageToGCS] Real file path:', realFilePath);

      // 移除 file:// 前綴
      const cleanPath = realFilePath.replace('file://', '');

      // 上傳檔案
      const response = await ReactNativeBlobUtil.fetch(
        'PUT',
        uploadUrl,
        {
          'Content-Type': contentType,
        },
        ReactNativeBlobUtil.wrap(cleanPath),
      );

      console.log('[uploadImageToGCS] GCS response status:', response.info().status);

      const success = response.info().status >= 200 && response.info().status < 300;

      if (success) {
        console.log('[uploadImageToGCS] GCS upload successful!');
      } else {
        console.error('[uploadImageToGCS] GCS upload failed:', response.info().status, response.text());
      }

      return success;
    }

    // 一般檔案路徑使用 wrap
    console.log('[uploadImageToGCS] Uploading to GCS using ReactNativeBlobUtil.wrap...');

    // 移除 file:// 前綴
    const cleanPath = filePath.replace('file://', '');

    const response = await ReactNativeBlobUtil.fetch(
      'PUT',
      uploadUrl,
      {
        'Content-Type': contentType,
      },
      ReactNativeBlobUtil.wrap(cleanPath),
    );

    console.log('[uploadImageToGCS] GCS response status:', response.info().status);

    const success = response.info().status >= 200 && response.info().status < 300;

    if (success) {
      console.log('[uploadImageToGCS] GCS upload successful!');
    } else {
      console.error('[uploadImageToGCS] GCS upload failed:', response.info().status, response.text());
    }

    return success;
  } catch (error) {
    console.error('[uploadImageToGCS] Error:', error);
    if (error instanceof Error) {
      console.error('[uploadImageToGCS] Error message:', error.message);
      console.error('[uploadImageToGCS] Error stack:', error.stack);
    }
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
    console.log('[uploadSingleImage] Starting upload process');

    if (!imageAsset.uri) {
      console.error('[uploadSingleImage] Image URI is missing');
      return null;
    }

    console.log('[uploadSingleImage] Image URI:', imageAsset.uri);

    // 1. 取得副檔名和日期
    const extname = getFileExtension(imageAsset.uri);
    const date = formatDateForUpload();

    console.log('[uploadSingleImage] File extension:', extname);
    console.log('[uploadSingleImage] Date:', date);

    // 2. 取得上傳資訊
    console.log('[uploadSingleImage] Getting upload info from API...');
    const uploadInfo = await getUploadInfo({ extname, date });

    console.log('[uploadSingleImage] Upload info received:', {
      hasUrl: !!uploadInfo.url,
      hasCdnUrl: !!uploadInfo.cdn_url,
      storage: uploadInfo.storage,
    });

    // 3. 上傳圖片到 GCS
    console.log('[uploadSingleImage] Uploading to GCS...');
    const success = await uploadImageToGCS(uploadInfo.url, imageAsset);

    if (!success) {
      console.error('[uploadSingleImage] Failed to upload image to GCS');
      return null;
    }

    console.log('[uploadSingleImage] Upload successful! CDN URL:', uploadInfo.cdn_url);

    // 4. 返回 CDN URL
    return uploadInfo.cdn_url;
  } catch (error) {
    console.error('[uploadSingleImage] Error:', error);
    if (error instanceof Error) {
      console.error('[uploadSingleImage] Error message:', error.message);
      console.error('[uploadSingleImage] Error stack:', error.stack);
    }
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
