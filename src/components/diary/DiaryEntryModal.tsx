import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { FontelloIcon } from '@/components';
import { Colors } from '@/theme';

interface DiaryEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: 'breakfast', icon: 'breakfast', label: '早餐' },
  { id: 'lunch', icon: 'lunch', label: '午餐' },
  { id: 'dinner', icon: 'dinner', label: '晚餐' },
  { id: 'snack', icon: 'snacks', label: '點心' },
  { id: 'exercise', icon: 'exercise', label: '運動' },
  { id: 'life', icon: 'life', label: '生活' },
  { id: 'water', icon: 'ic_local_drink_24px', label: '飲水' },
  { id: 'toilet', icon: 'ic_wc_24px', label: '上廁所' },
  { id: 'body', icon: 'ic_insert_chart_24px', label: '身體數據' },
  { id: 'supplement', icon: 'pill', label: '保健品' },
];

export default function DiaryEntryModal({
  visible,
  onClose,
  onSelectCategory,
}: DiaryEntryModalProps) {
  const handleCategoryPress = (categoryId: string) => {
    onSelectCategory(categoryId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerPlaceholder} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <FontelloIcon name="ic_close_24px" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Categories Grid */}
          <View style={styles.grid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <FontelloIcon
                    name={category.icon}
                    size={48}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',

  },
  container: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headerPlaceholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconContainer: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
});
