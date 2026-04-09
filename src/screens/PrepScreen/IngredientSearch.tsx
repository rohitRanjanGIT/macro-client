import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { Colors } from '../../constants/colors';

interface FoodEntry {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const FOOD_DB: FoodEntry[] = [
  { name: 'Chickpeas (boiled)', serving: '100g', calories: 164, protein: 9, carbs: 27, fat: 3 },
  { name: 'Kabuli chana (dried)', serving: '100g', calories: 340, protein: 19, carbs: 61, fat: 5 },
  { name: 'Onion', serving: '1 medium (110g)', calories: 44, protein: 1, carbs: 10, fat: 0 },
  { name: 'Tomato', serving: '1 medium (120g)', calories: 22, protein: 1, carbs: 5, fat: 0 },
  { name: 'Oil (vegetable)', serving: '1 tbsp (14g)', calories: 124, protein: 0, carbs: 0, fat: 14 },
  { name: 'Ginger garlic paste', serving: '1 tbsp (15g)', calories: 20, protein: 1, carbs: 4, fat: 0 },
  { name: 'Spices mix', serving: '1 tsp (5g)', calories: 15, protein: 0, carbs: 3, fat: 0 },
  { name: 'Paneer', serving: '100g', calories: 265, protein: 18, carbs: 3, fat: 20 },
  { name: 'Butter', serving: '1 tbsp (14g)', calories: 102, protein: 0, carbs: 0, fat: 12 },
  { name: 'Cream (heavy)', serving: '2 tbsp (30g)', calories: 103, protein: 1, carbs: 1, fat: 11 },
  { name: 'Rice (raw)', serving: '100g', calories: 365, protein: 7, carbs: 80, fat: 1 },
  { name: 'Rolled oats', serving: '50g', calories: 190, protein: 6, carbs: 34, fat: 3 },
  { name: 'Moong dal (cooked)', serving: '1 katori (200g)', calories: 180, protein: 14, carbs: 28, fat: 2 },
  { name: 'Roti (whole wheat)', serving: '1 piece (40g)', calories: 120, protein: 4, carbs: 20, fat: 3 },
  { name: 'Potato', serving: '1 medium (150g)', calories: 116, protein: 3, carbs: 26, fat: 0 },
  { name: 'Cauliflower', serving: '1 cup (100g)', calories: 25, protein: 2, carbs: 5, fat: 0 },
  { name: 'Curd (plain)', serving: '1 bowl (150g)', calories: 90, protein: 7, carbs: 9, fat: 3 },
  { name: 'Banana', serving: '1 medium (120g)', calories: 107, protein: 1, carbs: 27, fat: 0 },
  { name: 'Honey', serving: '1 tsp (7g)', calories: 21, protein: 0, carbs: 6, fat: 0 },
  { name: 'Milk (full fat)', serving: '200ml', calories: 122, protein: 6, carbs: 10, fat: 6 },
];

interface IngredientSearchProps {
  existingNames: string[];
  onSelect: (food: FoodEntry) => void;
  onBack: () => void;
}

export default function IngredientSearch({ existingNames, onSelect, onBack }: IngredientSearchProps) {
  const [search, setSearch] = useState('');

  const filtered = FOOD_DB.filter(
    f => f.name.toLowerCase().includes(search.toLowerCase()) &&
         !existingNames.includes(f.name)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add ingredient</Text>
      </View>

      <View style={styles.searchBar}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Circle cx="11" cy="11" r="7" stroke={Colors.textMuted} strokeWidth="2" />
          <Line x1="16.5" y1="16.5" x2="21" y2="21" stroke={Colors.textMuted} strokeWidth="2" strokeLinecap="round" />
        </Svg>
        <TextInput
          style={styles.searchInput}
          placeholder="Search ingredient..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoFocus
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filtered.length === 0 && (
          <Text style={styles.emptyText}>No results for "{search}"</Text>
        )}
        {filtered.map((food, i) => (
          <TouchableOpacity key={i} style={styles.foodRow} onPress={() => onSelect(food)} activeOpacity={0.7}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodServing}>{food.serving}</Text>
            </View>
            <Text style={styles.foodCal}>{food.calories} kcal</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
    paddingHorizontal: 20,
  },
  backBtn: {
    fontSize: 15,
    color: Colors.accent,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    padding: 0,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border + '30',
  },
  foodName: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  foodServing: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  foodCal: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
