import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

const FILTERS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

interface RecipeFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function RecipeFilters({ activeFilter, onFilterChange }: RecipeFiltersProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterRow}
      style={styles.filterScroll}
    >
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterScroll: {
    flexGrow: 0,
    marginBottom: 16,
    overflow: 'visible',
  },
  filterRow: {
    gap: 8,
    alignItems: 'center',
  },
  filterPill: {
    paddingHorizontal: 18,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
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
