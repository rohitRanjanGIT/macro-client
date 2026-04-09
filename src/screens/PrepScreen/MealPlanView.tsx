import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import WeekStrip from './WeekStrip';
import DaySummary from './DaySummary';
import MealSlotList from './MealSlotList';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface PlannedMeal {
  type: string;
  name: string;
  calories: number;
}

function getWeekDates() {
  const today = new Date();
  const monday = new Date(today);
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(today.getDate() + diff);

  return DAYS.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label,
      date: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });
}

const MOCK_PLANS: Record<number, PlannedMeal[]> = {
  1: [
    { type: 'Breakfast', name: 'Morning oats combo', calories: 360 },
    { type: 'Lunch', name: 'Rice + chole + raita', calories: 620 },
    { type: 'Snack', name: 'Chai + biscuits', calories: 180 },
    { type: 'Dinner', name: 'Roti + dal + sabzi', calories: 820 },
  ],
};

const TARGET = 2100;

export default function MealPlanView() {
  const weekDates = getWeekDates();
  const [selectedDayIndex, setSelectedDayIndex] = useState(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  );

  const startDate = weekDates[0];
  const endDate = weekDates[6];
  const weekLabel = `${startDate.month} ${startDate.date} — ${endDate.month} ${endDate.date}`;

  const dayMeals = MOCK_PLANS[selectedDayIndex] || [];
  const planned = dayMeals.reduce((sum, m) => sum + m.calories, 0);
  const diff = planned - TARGET;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <WeekStrip
        weekDates={weekDates}
        selectedDayIndex={selectedDayIndex}
        onSelectDay={setSelectedDayIndex}
        weekLabel={weekLabel}
      />
      <DaySummary planned={planned} target={TARGET} diff={diff} />
      <MealSlotList meals={dayMeals} />

      <View style={styles.weekDots}>
        {weekDates.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              selectedDayIndex === index && styles.dotActive,
              MOCK_PLANS[index] && styles.dotFilled,
            ]}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  weekDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: Colors.cardBackground,
  },
  dotActive: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  dotFilled: {
    backgroundColor: Colors.textMuted,
  },
});
