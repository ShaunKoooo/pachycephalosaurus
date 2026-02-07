import React, { useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Colors } from '@/theme';
import { useTranslation } from 'react-i18next';

interface WeekStripProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  markedDates?: { [date: string]: any };
}

const SCREEN_WIDTH = Dimensions.get('window').width;

// Helper functions for date manipulation
const getWeekDates = (dateString: string) => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const monday = new Date(date);

  // Adjust to Monday (1 is Monday)
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(date.getDate() + diff);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push(day);
  }

  return week;
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const isSameDay = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const WeekStrip: React.FC<WeekStripProps> = ({
  selectedDate,
  onDateSelect,
  markedDates = {},
}) => {
  const { i18n } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dayNamesShort = {
    'zh-TW': ['日', '一', '二', '三', '四', '五', '六'],
    'zh-CN': ['日', '一', '二', '三', '四', '五', '六'],
    'en': ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    'ja': ['日', '月', '火', '水', '木', '金', '土'],
    'ko': ['일', '월', '화', '수', '목', '금', '토'],
  }[i18n.language] || ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Generate 3 weeks (previous, current, next)
  const generateWeeks = useCallback(() => {
    const currentWeek = getWeekDates(selectedDate);
    const currentMonday = currentWeek[0];

    const previousMonday = new Date(currentMonday);
    previousMonday.setDate(currentMonday.getDate() - 7);

    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(currentMonday.getDate() + 7);

    return [
      getWeekDates(formatDate(previousMonday)),
      currentWeek,
      getWeekDates(formatDate(nextMonday)),
    ];
  }, [selectedDate]);

  const weeks = generateWeeks();

  const handleScrollEnd = useCallback((event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const weekIndex = Math.round(offsetX / SCREEN_WIDTH);

    // Clear any pending timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    if (weekIndex !== 1) {
      isScrollingRef.current = true;

      const targetWeek = weeks[weekIndex];

      if (targetWeek && targetWeek.length > 0) {
        // Find the same day of week in the new week
        const currentDate = new Date(selectedDate);
        const currentDayOfWeek = currentDate.getDay();
        const adjustedIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

        const newDate = targetWeek[adjustedIndex];
        onDateSelect(formatDate(newDate));
      }
    }
  }, [weeks, selectedDate, onDateSelect]);

  // Reset scroll position when selectedDate changes
  useEffect(() => {
    if (isScrollingRef.current) {
      // Wait a bit for the date selection to complete
      scrollTimeoutRef.current = setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: false });
        isScrollingRef.current = false;
      }, 100);
    } else {
      // For external date changes (like from calendar modal)
      scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: false });
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [selectedDate]);

  const renderDay = (date: Date, index: number) => {
    const dateString = formatDate(date);
    const isSelected = isSameDay(dateString, selectedDate);
    const isTodayDate = isToday(date);
    const hasMarker = markedDates[dateString]?.marked;

    return (
      <TouchableOpacity
        key={`${dateString}-${index}`}
        style={[
          styles.dayContainer,
          isSelected && styles.selectedDay,
        ]}
        onPress={() => onDateSelect(dateString)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dayName,
          isSelected && styles.selectedDayText,
          isTodayDate && !isSelected && styles.todayText,
        ]}>
          {dayNamesShort[date.getDay()]}
        </Text>
        {/* <Text style={[
          styles.dayNumber,
          isSelected && styles.selectedDayText,
          isTodayDate && !isSelected && styles.todayText,
        ]}>
          {date.getDate()}
        </Text> */}
        {hasMarker && (
          <View style={[
            styles.marker,
            isSelected && styles.selectedMarker,
          ]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        contentOffset={{ x: SCREEN_WIDTH, y: 0 }}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start"
      >
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekContainer}>
            {week.map((date, dayIndex) => renderDay(date, dayIndex))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const DAY_SIZE = 48; // 正方形尺寸

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  weekContainer: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 11,
  },
  dayContainer: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    gap: 2,
  },
  selectedDay: {
    backgroundColor: Colors.primary,
  },
  dayName: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  dayNumber: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  todayText: {
    color: Colors.primaryLight,
  },
  marker: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primaryLight,
    marginTop: 2,
  },
  selectedMarker: {
    backgroundColor: '#FFFFFF',
  },
});

export default WeekStrip;
