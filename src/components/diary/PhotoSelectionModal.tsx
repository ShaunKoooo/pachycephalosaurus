import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FontelloIcon } from '@/components';
import PhotoGridTab from './PhotoGridTab';

interface PhotoSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPhoto: (uri: string) => void;
  category: string;
  onSkip?: () => void;
}

type TabType = 'photos' | 'videos' | 'recent' | 'draft';

export default function PhotoSelectionModal({
  visible,
  onClose,
  onSelectPhoto,
  category,
  onSkip,
}: PhotoSelectionModalProps) {
  const [selectedTab, setSelectedTab] = useState<TabType>('photos');

  const tabs = [
    { id: 'photos' as TabType, label: '照片' },
    { id: 'videos' as TabType, label: '影片' },
    { id: 'recent' as TabType, label: '最近上傳' },
    { id: 'draft' as TabType, label: '草稿' },
  ];

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onClose();
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
            style={styles.headerButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <FontelloIcon name="ic_close_24px" size={28} color="#000000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>選擇影像</Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>略過</Text>
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
            <PhotoGridTab visible={visible && selectedTab === 'photos'} onSelectPhoto={onSelectPhoto} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>此功能尚未實作</Text>
            </View>
          )}
        </ScrollView>
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
    color: '#007AFF',
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
});
