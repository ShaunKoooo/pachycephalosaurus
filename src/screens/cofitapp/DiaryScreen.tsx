import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WeekStrip, CalendarModal } from '@/components/calendar';
import { DiaryEntryModal } from '@/components/diary';
import { setCalendarLocale } from '@/utils/calendarConfig';
import { getTodayString } from '@/utils/dateHelpers';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/theme';
import { FontelloIcon } from '@/components';

export default function DiaryScreen() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation('diary');
  const [selectedDate, setSelectedDate] = useState(() => getTodayString());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);

  // Update calendar locale when app language changes
  useEffect(() => {
    setCalendarLocale(i18n.language as any);
  }, [i18n.language]);

  // Configure navigation header
  useLayoutEffect(() => {
    const today = getTodayString();
    const isToday = selectedDate === today;

    // Show "今日" for today, otherwise show formatted date (MM-DD)
    const displayText = isToday ? t('today', '今天') : selectedDate.substring(5);

    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.dateText}>{displayText}</Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={handleCalendarButtonPress}
          activeOpacity={0.7}
        >
          <FontelloIcon name="ic_date_range_24px" size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddButtonPress}
          activeOpacity={0.7}
        >
          <FontelloIcon name="ic_add_box_24px" size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedDate, t]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleCalendarButtonPress = () => {
    setShowCalendarModal(true);
  };

  const handleModalClose = () => {
    setShowCalendarModal(false);
  };

  const handleAddButtonPress = () => {
    setShowEntryModal(true);
  };

  const handleEntryModalClose = () => {
    setShowEntryModal(false);
  };

  const handleCategorySelect = (category: string) => {
    console.log('Selected category:', category);
    // TODO: Navigate to the appropriate screen based on category
  };

  // Example marked dates (you can replace this with your actual data)
  const markedDates = {
    // Add dots for dates with data
    // '2026-02-03': { marked: true, dotColor: Colors.primaryLight },
    // '2026-02-04': { marked: true, dotColor: Colors.primaryLight },
  };

  return (
    <View style={styles.container}>
      {/* Week Strip - Swipeable Mon-Sun */}
      <WeekStrip
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        markedDates={markedDates}
      />

      {/* Calendar Modal */}
      <CalendarModal
        visible={showCalendarModal}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onClose={handleModalClose}
        markedDates={markedDates}
      />

      {/* Diary Entry Modal */}
      <DiaryEntryModal
        visible={showEntryModal}
        onClose={handleEntryModalClose}
        onSelectCategory={handleCategorySelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
  },
  todayButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  calendarButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});
