import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { FilterKey, FILTERS } from './types';

interface MealFiltersProps {
  active: FilterKey;
  onChange: (filter: FilterKey) => void;
}

export default function MealFilters({ active, onChange }: MealFiltersProps) {
  return (
    <View style={styles.row}>
      {FILTERS.map(f => (
        <TouchableOpacity
          key={f.key}
          style={[styles.pill, active === f.key && styles.pillActive]}
          onPress={() => onChange(f.key)}
          activeOpacity={0.7}
        >
          <Text style={[styles.text, active === f.key && styles.textActive]}>{f.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.cardBackground,
  },
  pillActive: {
    backgroundColor: Colors.text,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  textActive: {
    color: Colors.background,
  },
});
