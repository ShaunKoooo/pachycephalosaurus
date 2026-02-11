import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  CameraRoll,
  PhotoIdentifier,
  iosRefreshGallerySelection,
  cameraRollEventEmitter,
} from '@react-native-camera-roll/camera-roll';
import { FontelloIcon } from '@/components';
import { hasAndroidPermission, hasCameraPermission } from '@/utils/permissions';
import { Colors } from '@/theme/Colors';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 4) / 3; // 3 columns with 2px gaps

interface PhotoGridTabProps {
  visible: boolean;
  onSelectPhoto: (uri: string) => void;
}

export default function PhotoGridTab({ visible, onSelectPhoto }: PhotoGridTabProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [manuallySelectedPhotos, setManuallySelectedPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load photos from camera roll when tab becomes visible or refreshKey changes
  useEffect(() => {
    if (visible) {
      loadPhotos();
    }
  }, [visible, refreshKey]);

  // Debug: Log when photos state changes
  useEffect(() => {
    console.log(`Photos state changed: ${photos.length} photos`);
  }, [photos]);

  // Listen for iOS photo library selection changes
  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    console.log('Setting up iOS photo library change listener...');
    const subscription = cameraRollEventEmitter.addListener(
      'onLibrarySelectionChange',
      (event) => {
        console.log('iOS photo library selection changed:', event);
        // Reload photos when authorization list changes
        loadPhotos();
      }
    );

    return () => {
      console.log('Removing iOS photo library change listener');
      subscription.remove();
    };
  }, []);

  const loadPhotos = async () => {
    try {
      // Check permissions first
      const hasPermission = await hasAndroidPermission();
      if (!hasPermission) {
        console.log('Permission denied for photo access');
        Alert.alert('權限被拒絕', '需要訪問相簿的權限才能選擇照片');
        return;
      }

      setLoading(true);

      // Fetch photos from camera roll
      const result = await CameraRoll.getPhotos({
        first: 50, // Load first 50 photos
        assetType: 'Photos',
      });

      console.log(`Loaded ${result.edges.length} photos from camera roll`);
      console.log('Photo URIs:', result.edges.map(e => e.node.image.uri));

      // Force a new array reference to trigger re-render
      setPhotos([...result.edges]);

      console.log('Photos state updated, should trigger re-render');
    } catch (error) {
      console.error('Error loading photos:', error);
      Alert.alert('錯誤', '無法載入照片');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGallery = async () => {
    try {
      if (Platform.OS === 'ios') {
        // On iOS, use the native Limited Library Picker
        // This allows users to manage which photos are authorized for the app
        const success = await iosRefreshGallerySelection();
        console.log('iOS Limited Library Picker result:', success);

        if (success) {
          // Give iOS a moment to update the authorization list
          // Then trigger re-load by updating refreshKey
          console.log('Waiting for iOS to update authorization list...');
          setTimeout(() => {
            console.log('Triggering photo reload via refreshKey...');
            setRefreshKey(prev => prev + 1);
          }, 100); // Very short delay, just enough for iOS to update
        }
      } else {
        // On Android, use the standard image library picker
        const result = await launchImageLibrary({
          mediaType: 'photo',
          selectionLimit: 0, // 0 means unlimited
          quality: 0.8,
        });

        if (result.assets && result.assets.length > 0) {
          const uris = result.assets.map(asset => asset.uri || '').filter(Boolean);
          console.log(`User selected ${uris.length} photos from gallery picker:`, uris);
          setSelectedImages(prev => [...prev, ...uris]);
          setManuallySelectedPhotos(prev => [...prev, ...uris]);

          // Reload photos from CameraRoll to get the updated list
          // This ensures selected photos persist across sessions
          console.log('Reloading photos after Android gallery selection...');
          setRefreshKey(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('錯誤', '無法開啟相簿');
    }
  };

  const handleTakePhoto = async () => {
    try {
      // Check camera permission first
      const hasPermission = await hasCameraPermission();
      if (!hasPermission) {
        Alert.alert('權限被拒絕', '需要相機權限才能拍照');
        return;
      }

      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
      });

      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          setSelectedImages(prev => [...prev, uri]);
          setManuallySelectedPhotos(prev => [...prev, uri]);
          // Reload photos to show the newly taken photo
          loadPhotos();
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('錯誤', '無法開啟相機');
    }
  };

  const handleToggleImage = (uri: string) => {
    setSelectedImages(prev => {
      if (prev.includes(uri)) {
        // Remove from selection
        return prev.filter(item => item !== uri);
      }
      // Add to selection
      return [...prev, uri];
    });
  };

  const getSelectionNumber = (uri: string): number | null => {
    const index = selectedImages.indexOf(uri);
    return index >= 0 ? index + 1 : null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>載入中...</Text>
      </View>
    );
  }

  console.log('Rendering PhotoGridTab with', photos.length, 'photos and', manuallySelectedPhotos.length, 'manually selected');

  return (
    <View style={styles.photoGrid}>
      {/* Action Buttons as Grid Items */}
      <TouchableOpacity
        style={styles.gridActionItem}
        onPress={handleOpenGallery}
        activeOpacity={0.7}
      >
        <View style={styles.gridActionIconContainer}>
          <FontelloIcon name="image" size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.gridActionLabel}>開啟相簿</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.gridActionItem}
        onPress={handleTakePhoto}
        activeOpacity={0.7}
      >
        <View style={styles.gridActionIconContainer}>
          <FontelloIcon name="camera" size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.gridActionLabel}>拍照</Text>
      </TouchableOpacity>

      {/* Manually selected photos from gallery picker (shown first) */}
      {manuallySelectedPhotos.map((uri, index) => {
        const selectionNumber = getSelectionNumber(uri);
        const isSelected = selectionNumber !== null;
        return (
          <TouchableOpacity
            key={`manual-${index}`}
            style={styles.photoItem}
            onPress={() => handleToggleImage(uri)}
            activeOpacity={0.9}
          >
            <Image source={{ uri }} style={styles.photoImage} />
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected ? (
                  <Text style={styles.selectionNumber}>{selectionNumber}</Text>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Photos from camera roll */}
      {photos
        .filter(photo => !manuallySelectedPhotos.includes(photo.node.image.uri))
        .map((photo, index) => {
          const imageUri = photo.node.image.uri;
          const selectionNumber = getSelectionNumber(imageUri);
          const isSelected = selectionNumber !== null;
          return (
            <TouchableOpacity
              key={`photo-${index}`}
              style={styles.photoItem}
              onPress={() => handleToggleImage(imageUri)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: imageUri }} style={styles.photoImage} />
              <View style={styles.checkboxContainer}>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected ? (
                    <Text style={styles.selectionNumber}>{selectionNumber}</Text>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  gridActionItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridActionIconContainer: {
    marginBottom: 8,
  },
  gridActionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  photoItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  checkboxContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
});
