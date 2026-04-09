import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';

interface PlannedMeal {
  type: string;
  name: string;
  calories: number;
}

interface MealSlotListProps {
  meals: PlannedMeal[];
}

export default function MealSlotList({ meals }: MealSlotListProps) {
  if (meals.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No meals planned for this day</Text>
        <Text style={styles.emptyHint}>Tap a slot to assign a recipe</Text>
      </View>
    );
  }

  return (
    <>
      {meals.map((meal, index) => (
        <TouchableOpacity key={index} style={styles.mealSlot} activeOpacity={0.7}>
          <View>
            <Text style={styles.mealType}>{meal.type}</Text>
            <Text style={styles.mealName}>{meal.name}</Text>
          </View>
          <Text style={styles.mealCal}>{meal.calories}</Text>
        </TouchableOpacity>
      ))}
      {meals.length < 4 && (
        <TouchableOpacity style={styles.addSlot} activeOpacity={0.7}>
          <Text style={styles.addSlotText}>+ Add meal slot</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
});
