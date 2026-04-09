import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';

interface DayInfo {
  label: string;
  date: number;
  month: string;
}

interface WeekStripProps {
  weekDates: DayInfo[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
  weekLabel: string;
}

export default function WeekStrip({ weekDates, selectedDayIndex, onSelectDay, weekLabel }: WeekStripProps) {
  return (
    <>
      <View style={styles.weekNav}>
        <TouchableOpacity hitSlop={12}>
          <Text style={styles.navArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.weekLabel}>{weekLabel}</Text>
        <TouchableOpacity hitSlop={12}>
          <Text style={styles.navArrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dayStrip}>
        {weekDates.map((day, index) => (
          <TouchableOpacity
            key={day.label}
            style={[styles.dayCell, selectedDayIndex === index && styles.dayCellActive]}
            onPress={() => onSelectDay(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dayLabel, selectedDayIndex === index && styles.dayLabelActive]}>
              {day.label}
            </Text>
            <Text style={[styles.dayDate, selectedDayIndex === index && styles.dayDateActive]}>
              {day.date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  weekNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  navArrow: {
    fontSize: 18,
    color: Colors.textSecondary,
    paddingHorizontal: 8,
  },
  weekLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  dayStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayCell: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    minWidth: 40,
  },
  dayCellActive: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  dayLabelActive: {
    color: Colors.text,
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  dayDateActive: {
    color: Colors.text,
  },
});
