import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { FontelloIcon } from '@/components';
import { AddDiaryIcon } from '@/components/common/svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH;
const CARD_HORIZONTAL_MARGIN = 16;

export interface PhotoCard {
  id: string;
  photoUri?: string;
  title: string;
  cardCount?: number;
}

interface PhotoCarouselProps {
  cards: PhotoCard[];
  onAddPhoto: (cardIndex: number) => void;
  onDeletePhoto: (cardIndex: number) => void;
  onCardChange?: (cardIndex: number) => void;
  height?: number;
}

export default function PhotoCarousel({
  cards,
  onAddPhoto,
  onDeletePhoto,
  onCardChange,
  height = 283,
}: PhotoCarouselProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const carouselRef = useRef(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);
    if (index !== currentCardIndex) {
      setCurrentCardIndex(index);
      onCardChange?.(index);
    }
  };

  const handleAddPhoto = () => {
    onAddPhoto(currentCardIndex);
  };

  const handleDeletePhoto = () => {
    onDeletePhoto(currentCardIndex);
  };

  return (
    <View style={styles.carouselContainer}>
      <View style={[styles.carouselWrapper, { height }]}>
        <FlashList
          ref={carouselRef}
          data={cards}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.photoCardWrapper}>
              <View style={styles.photoCard}>
                {item.photoUri ? (
                  <>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={handleDeletePhoto}
                      activeOpacity={0.7}
                    >
                      <FontelloIcon name="ic_delete_24px" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                    <Image source={{ uri: item.photoUri }} style={styles.photoImage} />
                  </>
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoPlaceholderText}>{item.title}</Text>
                    <Text style={styles.photoPlaceholderSubtext}>預設背景，點擊修改</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handleAddPhoto}
                  activeOpacity={0.7}
                >
                  <AddDiaryIcon width={32} height={32} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* Pagination dots and Card Count */}
      <View style={styles.paginationContainer}>
        <View style={styles.spacer} />
        <View style={styles.paginationDots}>
          {cards.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentCardIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        <View style={styles.cardCountContainer}>
          <FontelloIcon name="ic_insert_invitation_24px" size={20} color="#666666" />
          <Text style={styles.cardCountText}>{cards[currentCardIndex]?.cardCount || 0} 天卡</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    marginBottom: 24,
  },
  carouselWrapper: {
    width: SCREEN_WIDTH,
  },
  photoCardWrapper: {
    width: CARD_WIDTH,
    paddingHorizontal: CARD_HORIZONTAL_MARGIN,
  },
  photoCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    height: 283,
    width: 283,
    marginTop: 15,
    position: 'relative',
    alignSelf: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 8,
  },
  photoImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
  },
  photoPlaceholderSubtext: {
    fontSize: 14,
    color: '#999999',
  },
  addPhotoButton: {
    position: 'absolute',
    right: 16,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: CARD_HORIZONTAL_MARGIN,
  },
  spacer: {
    flex: 1,
  },
  paginationDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
  },
  paginationDotActive: {
    backgroundColor: '#000000',
  },
  cardCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cardCountText: {
    fontSize: 14,
    color: '#666666',
  },
});
