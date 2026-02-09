import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { CalendarList, DateData } from 'react-native-calendars';
import { Colors } from '@/theme';

interface WeekCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  markedDates?: { [date: string]: any };
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  selectedDate,
  onDateSelect,
  markedDates = {},
}) => {
  const calendarRef = useRef(null);

  const handleDayPress = useCallback((day: DateData) => {
    onDateSelect(day.dateString);
  }, [onDateSelect]);

  // Merge marked dates with selected date
  const mergedMarkedDates = {
    ...markedDates,
    [selectedDate]: {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: Colors.primary,
      selectedTextColor: '#FFFFFF',
    },
  };

  return (
    <View style={styles.container}>
      <CalendarList
        ref={calendarRef}
        current={selectedDate}
        horizontal={true}
        pagingEnabled={true}
        calendarWidth={SCREEN_WIDTH}
        pastScrollRange={24}
        futureScrollRange={24}
        scrollEnabled={true}
        showScrollIndicator={false}
        onDayPress={handleDayPress}
        markedDates={mergedMarkedDates}
        hideExtraDays={false}
        firstDay={1} // Monday as first day
        theme={{
          backgroundColor: '#FFFFFF',
          calendarBackground: '#FFFFFF',
          textSectionTitleColor: '#8E8E93',
          selectedDayBackgroundColor: Colors.primary,
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: Colors.primaryLight,
          dayTextColor: '#000000',
          textDisabledColor: '#D1D1D6',
          dotColor: Colors.primaryLight,
          selectedDotColor: '#FFFFFF',
          arrowColor: Colors.primary,
          monthTextColor: '#000000',
          indicatorColor: Colors.primary,
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 13,
          textDayFontWeight: '400',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '400',
        }}
        style={styles.calendar}
        // Performance optimization
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={3}
        windowSize={3}
        initialNumToRender={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 350,
    backgroundColor: '#FFFFFF',
  },
  calendar: {
    height: 350,
  },
});

export default WeekCalendar;
