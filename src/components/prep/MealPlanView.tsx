import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface PlannedMeal {
  type: string;
  name: string;
  calories: number;
}

interface DayPlan {
  date: number;
  meals: PlannedMeal[];
  planned: number;
}

function getWeekDates(): { label: string; date: number; month: string }[] {
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

export default function MealPlanView() {
  const weekDates = getWeekDates();
  const [selectedDayIndex, setSelectedDayIndex] = useState(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  );

  const selectedDate = weekDates[selectedDayIndex];
  const startDate = weekDates[0];
  const endDate = weekDates[6];
  const weekLabel = `${startDate.month} ${startDate.date} — ${endDate.month} ${endDate.date}`;

  // Use mock data for Tuesday (index 1), empty for others
  const dayMeals = MOCK_PLANS[selectedDayIndex] || [];
  const planned = dayMeals.reduce((sum, m) => sum + m.calories, 0);
  const target = 2100;
  const diff = planned - target;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Week navigation */}
      <View style={styles.weekNav}>
        <TouchableOpacity hitSlop={12}>
          <Text style={styles.navArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.weekLabel}>{weekLabel}</Text>
        <TouchableOpacity hitSlop={12}>
          <Text style={styles.navArrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Day strip */}
      <View style={styles.dayStrip}>
        {weekDates.map((day, index) => (
          <TouchableOpacity
            key={day.label}
            style={[styles.dayCell, selectedDayIndex === index && styles.dayCellActive]}
            onPress={() => setSelectedDayIndex(index)}
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

      {/* Summary stats */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.summaryBorder]}>
          <Text style={styles.summaryLabel}>Planned</Text>
          <Text style={styles.summaryValue}>{planned.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryBorder]}>
          <Text style={styles.summaryLabel}>Target</Text>
          <Text style={styles.summaryValue}>{target.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Diff</Text>
          <Text
            style={[
              styles.summaryValue,
              { color: diff > 0 ? Colors.mealBreakfast : diff < 0 ? Colors.remaining : Colors.text },
            ]}
          >
            {diff > 0 ? '+' : ''}{diff}
          </Text>
        </View>
      </View>

      {/* Meal slots */}
      {dayMeals.length > 0 ? (
        dayMeals.map((meal, index) => (
          <TouchableOpacity key={index} style={styles.mealSlot} activeOpacity={0.7}>
            <View>
              <Text style={styles.mealType}>{meal.type}</Text>
              <Text style={styles.mealName}>{meal.name}</Text>
            </View>
            <Text style={styles.mealCal}>{meal.calories}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No meals planned for this day</Text>
          <Text style={styles.emptyHint}>Tap a slot to assign a recipe</Text>
        </View>
      )}

      {/* Empty slots hint for days with some meals */}
      {dayMeals.length > 0 && dayMeals.length < 4 && (
        <TouchableOpacity style={styles.addSlot} activeOpacity={0.7}>
          <Text style={styles.addSlotText}>+ Add meal slot</Text>
        </TouchableOpacity>
      )}

      {/* Week overview dots */}
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
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  summaryBorder: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  mealSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  mealType: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  mealName: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  mealCal: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  addSlot: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  addSlotText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 13,
    color: Colors.textMuted,
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
