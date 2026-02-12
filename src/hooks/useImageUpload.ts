import { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import { useLazyGetMediaUploadInfoQuery } from '../store/api/mediaApi';
import { uploadMultipleImages } from '../utils/imageUpload';
import { checkPhotoLibraryPermission } from '../utils/permissions';

interface UseImageUploadOptions {
  maxImages?: number; // 最多可選擇的圖片數量
  onSuccess?: (urls: string[]) => void; // 上傳成功的回調
  onError?: (error: string) => void; // 上傳失敗的回調
}

interface UseImageUploadReturn {
  isUploading: boolean;
  uploadProgress: { completed: number; total: number };
  pickAndUploadImages: () => Promise<void>;
  uploadedUrls: string[];
}

/**
 * 多張圖片上傳的 Hook
 *
 * @example
 * ```tsx
 * const { isUploading, uploadProgress, pickAndUploadImages, uploadedUrls } = useImageUpload({
 *   maxImages: 5,
 *   onSuccess: (urls) => console.log('Uploaded:', urls),
 *   onError: (error) => console.error('Error:', error),
 * });
 *
 * <Button onPress={pickAndUploadImages} disabled={isUploading}>
 *   {isUploading ? `上傳中 ${uploadProgress.completed}/${uploadProgress.total}` : '選擇圖片'}
 * </Button>
 * ```
 */
export const useImageUpload = (
  options: UseImageUploadOptions = {},
): UseImageUploadReturn => {
  const { maxImages = 10, onSuccess, onError } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    completed: 0,
    total: 0,
  });
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  // 使用 lazy query 以便手動觸發
  const [getUploadInfo] = useLazyGetMediaUploadInfoQuery();

  /**
   * 選擇並上傳圖片的主函數
   */
  const pickAndUploadImages = useCallback(async () => {
    try {
      // 1. 檢查相簿權限
      const hasPermission = await checkPhotoLibraryPermission();
      if (!hasPermission) {
        Alert.alert(
          '權限不足',
          '需要存取相簿權限才能選擇圖片',
          [{ text: '確定' }],
        );
        return;
      }

      // 2. 開啟圖片選擇器
      const imagePickerOptions: ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: maxImages, // 0 表示無限制，其他數字表示最多選擇數量
        quality: 0.8, // 圖片品質 0-1
        includeBase64: false,
      };

      const result = await launchImageLibrary(imagePickerOptions);

      // 3. 檢查是否取消選擇
      if (result.didCancel) {
        return;
      }

      // 4. 檢查是否有錯誤
      if (result.errorCode) {
        const errorMessage = result.errorMessage || '選擇圖片時發生錯誤';
        onError?.(errorMessage);
        Alert.alert('錯誤', errorMessage);
        return;
      }

      // 5. 檢查是否有選擇圖片
      const assets = result.assets;
      if (!assets || assets.length === 0) {
        return;
      }

      // 6. 開始上傳
      setIsUploading(true);
      setUploadProgress({ completed: 0, total: assets.length });

      // 7. 批次上傳圖片
      const urls = await uploadMultipleImages(
        assets,
        async (params) => {
          // 呼叫 API 取得上傳資訊
          const response = await getUploadInfo(params);
          if (response.error) {
            throw new Error('Failed to get upload info');
          }
          return response.data!;
        },
        (completed, total) => {
          // 更新上傳進度
          setUploadProgress({ completed, total });
        },
      );

      // 8. 上傳完成
      setUploadedUrls(urls);

      if (urls.length === assets.length) {
        onSuccess?.(urls);
      } else if (urls.length > 0) {
        // 部分成功
        Alert.alert(
          '部分上傳成功',
          `成功上傳 ${urls.length} / ${assets.length} 張圖片`,
        );
        onSuccess?.(urls);
      } else {
        // 全部失敗
        const errorMessage = '所有圖片上傳失敗';
        onError?.(errorMessage);
        Alert.alert('錯誤', errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '上傳圖片時發生錯誤';
      console.error('Error in pickAndUploadImages:', error);
      onError?.(errorMessage);
      Alert.alert('錯誤', errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [maxImages, getUploadInfo, onSuccess, onError]);

  return {
    isUploading,
    uploadProgress,
    pickAndUploadImages,
    uploadedUrls,
  };
};
