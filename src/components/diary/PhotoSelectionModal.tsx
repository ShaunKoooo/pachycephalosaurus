import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontelloIcon } from '@/components';
import PhotoGridTab from './PhotoGridTab';
import { Colors } from '@/theme';
import { useLazyGetMediaUploadInfoQuery } from '@/store/api/mediaApi';
import { uploadMultipleImages } from '@/utils/imageUpload';
import { Asset } from 'react-native-image-picker';

interface SelectedImageData {
  uri: string;
  fileName?: string;
  type?: string;
  fileSize?: number;
}

interface PhotoSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPhoto: (uri: string) => void;
  category: string;
  onSkip?: () => void;
  onUploadComplete?: (urls: string[]) => void;
}

type TabType = 'photos' | 'videos' | 'recent' | 'draft';

export default function PhotoSelectionModal({
  visible,
  onClose,
  onSelectPhoto,
  category,
  onSkip,
  onUploadComplete,
}: PhotoSelectionModalProps) {
  const [selectedTab, setSelectedTab] = useState<TabType>('photos');
  const [selectedImagesCount, setSelectedImagesCount] = useState(0);
  const [selectedImages, setSelectedImages] = useState<SelectedImageData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ completed: 0, total: 0 });

  const [getUploadInfo] = useLazyGetMediaUploadInfoQuery();

  const tabs = [
    { id: 'photos' as TabType, label: '照片' },
    { id: 'videos' as TabType, label: '影片' },
    { id: 'recent' as TabType, label: '最近上傳' },
    { id: 'draft' as TabType, label: '草稿' },
  ];

  const handleSelectionChange = useCallback((count: number, images: SelectedImageData[]) => {
    setSelectedImagesCount(count);
    setSelectedImages(images);
  }, []);

  const handleNextStep = async () => {
    if (selectedImagesCount === 0) {
      // 沒有選擇圖片，直接略過
      if (onSkip) {
        onSkip();
      } else {
        onClose();
      }
      return;
    }

    // 開始上傳圖片
    try {
      setIsUploading(true);
      setUploadProgress({ completed: 0, total: selectedImages.length });

      // 將 SelectedImageData 轉換為 Asset 格式
      const assets: Asset[] = selectedImages.map(img => ({
        uri: img.uri,
        fileName: img.fileName,
        type: img.type,
        fileSize: img.fileSize,
      }));

      // 批次上傳圖片
      const uploadedUrls = await uploadMultipleImages(
        assets,
        async (params) => {
          const response = await getUploadInfo(params);
          if (response.error) {
            throw new Error('Failed to get upload info');
          }
          return response.data!;
        },
        (completed, total) => {
          setUploadProgress({ completed, total });
        },
      );

      if (uploadedUrls.length === 0) {
        Alert.alert('上傳失敗', '所有圖片上傳失敗，請重試');
        return;
      }

      if (uploadedUrls.length < selectedImages.length) {
        Alert.alert(
          '部分上傳成功',
          `成功上傳 ${uploadedUrls.length} / ${selectedImages.length} 張圖片`,
        );
      }

      // 通知父組件上傳完成
      if (onUploadComplete) {
        onUploadComplete(uploadedUrls);
      }

      // 如果有 onSkip 表示需要跳到下一步（FoodEntryModal）
      if (onSkip) {
        onSkip();
      } else {
        // 否則關閉 Modal
        onClose();
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('上傳失敗', '圖片上傳時發生錯誤，請重試');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: Colors.diaryHeaderButtonBackground, borderRadius: 100, width: 40 }]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <FontelloIcon name="ic_close_24px" size={28} color={Colors.diaryHeaderButtonIcon} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>選擇影像</Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleNextStep}
            activeOpacity={0.7}
            disabled={isUploading}
          >
            {isUploading ? (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="small" color="black" />
              </View>
            ) : (
              <Text style={styles.skipText}>
                {selectedImagesCount > 0 ? '下一步' : '略過'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                selectedTab === tab.id && styles.activeTab,
              ]}
              onPress={() => setSelectedTab(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.id && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {selectedTab === 'photos' ? (
            <PhotoGridTab
              visible={visible && selectedTab === 'photos'}
              onSelectPhoto={onSelectPhoto}
              onSelectionChange={handleSelectionChange}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>此功能尚未實作</Text>
            </View>
          )}
        </ScrollView>

        {/* Upload Progress Overlay */}
        {isUploading && (
          <View style={styles.uploadOverlay}>
            <View style={styles.uploadCard}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.uploadText}>
                上傳中... {uploadProgress.completed} / {uploadProgress.total}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerButton: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  skipText: {
    fontSize: 17,
    fontWeight: '400',
    color: 'black',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#F9F9F9',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999999',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999999',
  },
  uploadingContainer: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 200,
  },
  uploadText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
});
