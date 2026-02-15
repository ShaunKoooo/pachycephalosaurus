import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FontelloIcon } from '@/components';
import { PhotoCarousel, PhotoCard } from '@/components/common';
import { Colors } from '@/theme';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useLazyGetMediaUploadInfoQuery } from '@/store/api/mediaApi';
import { uploadSingleImage } from '@/utils/imageUpload';

interface FoodEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onNext: (data: FoodEntryData) => void;
  onBack?: () => void;
  category: string;
  categoryLabel: string;
  date: string;
  selectedPhotoUri?: string;
  uploadedPhotoUrls?: string[];
}

export interface FoodEntryData {
  photoUri?: string;
  notes: string;
}

export default function FoodEntryModal({
  visible,
  onClose,
  onNext,
  onBack,
  category,
  categoryLabel,
  date,
  selectedPhotoUri,
  uploadedPhotoUrls = [],
}: FoodEntryModalProps) {
  // 根據傳入的照片數量動態生成卡片
  const generateInitialCards = (): PhotoCard[] => {
    if (uploadedPhotoUrls.length > 0) {
      return uploadedPhotoUrls.map((url, index) => ({
        id: String(index + 1),
        photoUri: url,
        title: `食物名稱${index > 0 ? ` ${index + 1}` : ''}`,
        cardCount: 0,
      }));
    } else if (selectedPhotoUri) {
      return [{ id: '1', photoUri: selectedPhotoUri, title: '食物名稱', cardCount: 0 }];
    }
    return [];
  };

  const [photoCards, setPhotoCards] = useState<PhotoCard[]>(generateInitialCards);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [getUploadInfo] = useLazyGetMediaUploadInfoQuery();

  // 當 uploadedPhotoUrls 改變時，重新生成 photoCards
  React.useEffect(() => {
    if (uploadedPhotoUrls.length > 0) {
      setPhotoCards(
        uploadedPhotoUrls.map((url, index) => ({
          id: String(index + 1),
          photoUri: url,
          title: `食物名稱${index > 0 ? ` ${index + 1}` : ''}`,
          cardCount: 0,
        }))
      );
    } else if (selectedPhotoUri) {
      setPhotoCards([{ id: '1', photoUri: selectedPhotoUri, title: '食物名稱', cardCount: 0 }]);
    }
  }, [uploadedPhotoUrls, selectedPhotoUri]);

  const handleDeletePhoto = (cardIndex: number) => {
    const updatedCards = [...photoCards];
    updatedCards[cardIndex] = {
      ...updatedCards[cardIndex],
      photoUri: undefined,
    };
    setPhotoCards(updatedCards);
  };

  const handleAddPhoto = async (cardIndex: number) => {
    // 顯示選項：拍照或從相簿選擇
    Alert.alert(
      '新增照片',
      '請選擇照片來源',
      [
        {
          text: '拍照',
          onPress: () => handleTakePhoto(cardIndex),
        },
        {
          text: '從相簿選擇',
          onPress: () => handleSelectFromLibrary(cardIndex),
        },
        {
          text: '取消',
          style: 'cancel',
        },
      ],
    );
  };

  const handleTakePhoto = async (cardIndex: number) => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
        includeBase64: false,
        includeExtra: true,
        // 對於 iOS，這會強制將圖片複製到應用的臨時目錄
        // 而不是返回 ph:// URI
        assetRepresentationMode: 'current', // 使用當前的實體檔案
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('[FoodEntryModal] Camera asset:', {
          uri: asset.uri,
          type: asset.type,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
        });
        await uploadAndSetPhoto(asset, cardIndex);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('錯誤', '無法開啟相機');
    }
  };

  const handleSelectFromLibrary = async (cardIndex: number) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
        includeExtra: true,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('[FoodEntryModal] Library asset:', {
          uri: asset.uri,
          type: asset.type,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
        });
        await uploadAndSetPhoto(asset, cardIndex);
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('錯誤', '無法開啟相簿');
    }
  };

  const uploadAndSetPhoto = async (asset: any, cardIndex: number) => {
    try {
      console.log('[FoodEntryModal] Starting upload for card', cardIndex);
      setIsUploading(true);

      // 上傳圖片
      const cdnUrl = await uploadSingleImage(
        asset,
        async (params) => {
          console.log('[FoodEntryModal] Getting upload info with params:', params);
          const response = await getUploadInfo(params);
          console.log('[FoodEntryModal] Upload info response:', response);

          if (response.error) {
            console.error('[FoodEntryModal] API error:', response.error);
            throw new Error(`Failed to get upload info: ${JSON.stringify(response.error)}`);
          }

          if (!response.data) {
            console.error('[FoodEntryModal] No data in response');
            throw new Error('No data received from upload info API');
          }

          return response.data;
        },
      );

      console.log('[FoodEntryModal] Upload complete, CDN URL:', cdnUrl);

      if (cdnUrl) {
        // 更新該卡片的照片
        const updatedCards = [...photoCards];
        updatedCards[cardIndex] = {
          ...updatedCards[cardIndex],
          photoUri: cdnUrl,
        };
        setPhotoCards(updatedCards);
        console.log('[FoodEntryModal] Photo card updated successfully');
      } else {
        console.error('[FoodEntryModal] Upload returned null CDN URL');
        Alert.alert('上傳失敗', '照片上傳失敗，請重試');
      }
    } catch (error) {
      console.error('[FoodEntryModal] Error uploading photo:', error);
      const errorMessage = error instanceof Error ? error.message : '未知錯誤';
      Alert.alert('上傳失敗', `照片上傳時發生錯誤：${errorMessage}`);
    } finally {
      console.log('[FoodEntryModal] Upload process finished, hiding loading');
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    // Get the first photo URI from the cards
    const firstPhotoUri = photoCards.find(card => card.photoUri)?.photoUri;
    onNext({
      photoUri: firstPhotoUri,
      notes,
    });
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  const handleButtonApp = () => {
    // TODO: Implement ButtonApp integration
    console.log('ButtonApp pressed');
  };

  const handleFoodDatabase = () => {
    // TODO: Implement food database selection
    console.log('Food database pressed');
  };

  const handleCustom = () => {
    // TODO: Implement custom food entry
    console.log('Custom pressed');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
      transparent={false}
    >
      <LinearGradient
        colors={['#FFFFFF', '#E6EEEE']}
        locations={[0, 0.86]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: Colors.diaryHeaderButtonBackground, borderRadius: 100, width: 40 }]}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <FontelloIcon name="ic_keyboard_arrow_left_24px" size={28} color={Colors.diaryHeaderButtonIcon} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{date} {categoryLabel}</Text>

          <TouchableOpacity
            style={{ marginRight: 8 }}
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Text style={styles.nextText}>下一步</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Photo Carousel */}
          <PhotoCarousel
            cards={photoCards}
            onAddPhoto={handleAddPhoto}
            onDeletePhoto={handleDeletePhoto}
          />

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleButtonApp}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>六大類份數紀錄</Text>
              <View style={styles.actionButtonIcon}>
                <FontelloIcon name="ic_add_circle_24px" size={24} color={Colors.primaryLight} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleFoodDatabase}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>由食物資料庫新增</Text>
              <View style={styles.actionButtonIcon}>
                <FontelloIcon name="ic_add_circle_24px" size={24} color={Colors.primaryLight} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCustom}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>自定義</Text>
              <View style={styles.actionButtonIcon}>
                <FontelloIcon name="ic_add_circle_24px" size={24} color={Colors.primaryLight} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Notes Section */}
          <View style={styles.notesContainer}>
            <View style={{
              alignItems: 'flex-start',
              backgroundColor: '#FFFFFF',
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderRadius: 12,
              gap: 12,
            }}>
              <Text style={styles.actionButtonText}>補充</Text>
              <View style={{ borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 8, width: '100%' }}>
                <TextInput
                  style={styles.notesInput}
                  placeholder="補充份量大小、烹飪方式、調味料等...."
                  placeholderTextColor="#CCCCCC"
                  value={notes}
                  onChangeText={setNotes}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Upload Progress Overlay */}
        {isUploading && (
          <View style={styles.uploadOverlay}>
            <View style={styles.uploadCard}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.uploadText}>上傳中...</Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  nextText: {
    fontSize: 17,
    fontWeight: '400',
    color: 'black',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  actionsContainer: {
    marginHorizontal: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  actionButtonIcon: {
    width: 24,
    height: 24,
  },
  notesContainer: {
    marginHorizontal: 16,
    gap: 12,
    marginTop: 16,
  },
  notesSection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  notesSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    fontSize: 15,
    color: '#000000',
    height: 50,
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
