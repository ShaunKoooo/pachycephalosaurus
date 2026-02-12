import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FontelloIcon } from '@/components';
import { PhotoCarousel, PhotoCard } from '@/components/common';
import { Colors } from '@/theme';

interface FoodEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onNext: (data: FoodEntryData) => void;
  onBack?: () => void;
  category: string;
  categoryLabel: string;
  date: string;
  selectedPhotoUri?: string;
  onOpenFoodCategory?: () => void;
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
  onOpenFoodCategory,
}: FoodEntryModalProps) {
  const [photoCards, setPhotoCards] = useState<PhotoCard[]>([
    { id: '1', photoUri: selectedPhotoUri, title: '食物名稱', cardCount: 0 },
    { id: '2', title: '食物名稱 2', cardCount: 0 },
    { id: '3', title: '食物名稱 3', cardCount: 0 },
    { id: '4', title: '食物名稱 4', cardCount: 0 },
  ]);
  const [notes, setNotes] = useState('');

  const handleDeletePhoto = (cardIndex: number) => {
    const updatedCards = [...photoCards];
    updatedCards[cardIndex] = {
      ...updatedCards[cardIndex],
      photoUri: undefined,
    };
    setPhotoCards(updatedCards);
  };

  const handleAddPhoto = (cardIndex: number) => {
    // TODO: Open photo picker or camera
    console.log('Add photo for card', cardIndex);
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
    if (onOpenFoodCategory) {
      onOpenFoodCategory();
    }
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
});
