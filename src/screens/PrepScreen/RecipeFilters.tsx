import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

const FILTERS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

interface RecipeFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function RecipeFilters({ activeFilter, onFilterChange }: RecipeFiltersProps) {
  return (
    <View style={styles.filterRow}>
      {FILTERS.map((item) => (
        <TouchableOpacity
          key={item}
          style={[styles.filterPill, activeFilter === item && styles.filterPillActive]}
          onPress={() => onFilterChange(item)}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
  },
  filterPillActive: {
    backgroundColor: Colors.text,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.background,
  },
});
