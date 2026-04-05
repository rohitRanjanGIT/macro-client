import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface MacroLegendProps {
  carbs: number;
  protein: number;
  fat: number;
}

export default function MacroLegend({ carbs, protein, fat }: MacroLegendProps) {
  const items = [
    { label: 'Carbs', value: `${carbs}g`, color: Colors.calorieRingCarbs },
    { label: 'Protein', value: `${protein}g`, color: Colors.calorieRingProtein },
    { label: 'Fat', value: `${fat}g`, color: Colors.calorieRingFat },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.text}>
            {item.label} {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
});
