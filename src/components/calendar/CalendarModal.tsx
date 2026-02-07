import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Pressable } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Colors } from '@/theme';
import { useTranslation } from 'react-i18next';

interface CalendarModalProps {
  visible: boolean;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClose: () => void;
  markedDates?: { [date: string]: any };
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  selectedDate,
  onDateSelect,
  onClose,
  markedDates = {},
}) => {
  const { t } = useTranslation('common');

  const handleDayPress = (day: DateData) => {
    onDateSelect(day.dateString);
    onClose();
  };

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
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.calendarWrapper}>
              <View style={styles.header}>
                <Text style={styles.headerText}>{t('selectDate', 'Select Date')}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Calendar
                current={selectedDate}
                onDayPress={handleDayPress}
                markedDates={mergedMarkedDates}
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
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 13,
                  textDayFontWeight: '400',
                  textMonthFontWeight: '600',
                  textDayHeaderFontWeight: '400',
                }}
                enableSwipeMonths={true}
              />
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  calendarWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '400',
  },
});

export default CalendarModal;
