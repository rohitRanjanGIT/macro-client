import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { useRecipes } from '../../context/RecipeContext';

export interface FoodOption {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const COMMON_FOODS: FoodOption[] = [
  { name: 'Roti (whole wheat)', serving: '1 piece', calories: 120, protein: 4, carbs: 20, fat: 3 },
  { name: 'Rice (steamed)', serving: '1 katori (150g)', calories: 195, protein: 4, carbs: 38, fat: 3 },
  { name: 'Dal tadka (moong)', serving: '1 bowl (200g)', calories: 180, protein: 12, carbs: 22, fat: 4 },
  { name: 'Dal makhani', serving: '1 bowl (200g)', calories: 260, protein: 14, carbs: 28, fat: 10 },
  { name: 'Jeera rice', serving: '1 katori (150g)', calories: 195, protein: 4, carbs: 38, fat: 3 },
  { name: 'Paneer butter masala', serving: '1 bowl (200g)', calories: 340, protein: 18, carbs: 12, fat: 24 },
  { name: 'Aloo sabzi', serving: '1 katori (120g)', calories: 150, protein: 3, carbs: 22, fat: 5 },
  { name: 'Aloo gobi', serving: '1 katori (150g)', calories: 130, protein: 3, carbs: 18, fat: 5 },
  { name: 'Rajma', serving: '1 bowl (200g)', calories: 210, protein: 12, carbs: 30, fat: 4 },
  { name: 'Chole', serving: '1 bowl (200g)', calories: 285, protein: 12, carbs: 34, fat: 10 },
  { name: 'Curd (plain)', serving: '1 bowl (150g)', calories: 90, protein: 7, carbs: 9, fat: 3 },
  { name: 'Raita (boondi)', serving: '1 bowl (100g)', calories: 85, protein: 3, carbs: 10, fat: 3 },
  { name: 'Paratha (aloo)', serving: '1 piece', calories: 220, protein: 5, carbs: 28, fat: 10 },
  { name: 'Poori', serving: '1 piece', calories: 150, protein: 3, carbs: 16, fat: 8 },
  { name: 'Salad (green)', serving: '1 plate', calories: 40, protein: 2, carbs: 8, fat: 0 },
  { name: 'Papad (roasted)', serving: '1 piece', calories: 45, protein: 3, carbs: 6, fat: 1 },
  { name: 'Pickle', serving: '1 tsp', calories: 15, protein: 0, carbs: 2, fat: 1 },
  { name: 'Chai', serving: '1 cup (150ml)', calories: 80, protein: 3, carbs: 10, fat: 3 },
  { name: 'Lassi (sweet)', serving: '1 glass (200ml)', calories: 180, protein: 6, carbs: 28, fat: 5 },
  { name: 'Buttermilk (chaas)', serving: '1 glass (200ml)', calories: 45, protein: 3, carbs: 5, fat: 1 },
  { name: 'Idli', serving: '1 piece', calories: 60, protein: 2, carbs: 12, fat: 0 },
  { name: 'Dosa (plain)', serving: '1 piece', calories: 135, protein: 3, carbs: 22, fat: 4 },
  { name: 'Sambar', serving: '1 bowl (200ml)', calories: 120, protein: 6, carbs: 16, fat: 3 },
  { name: 'Upma', serving: '1 bowl (200g)', calories: 210, protein: 5, carbs: 30, fat: 8 },
  { name: 'Poha', serving: '1 plate (200g)', calories: 250, protein: 5, carbs: 38, fat: 8 },
];

type PickerTab = 'foods' | 'recipes';

interface ComboFoodPickerProps {
  existingNames: string[];
  onSelect: (food: FoodOption) => void;
  onBack: () => void;
}

export default function ComboFoodPicker({ existingNames, onSelect, onBack }: ComboFoodPickerProps) {
  const { recipes } = useRecipes();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<PickerTab>('foods');

  const filteredFoods = COMMON_FOODS.filter(
    f => f.name.toLowerCase().includes(search.toLowerCase()) &&
         !existingNames.includes(f.name)
  );

  const filteredRecipes = recipes.filter(
    r => r.name.toLowerCase().includes(search.toLowerCase()) &&
         !existingNames.includes(r.name)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add food item</Text>
      </View>

      <View style={styles.searchBar}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Circle cx="11" cy="11" r="7" stroke={Colors.textMuted} strokeWidth="2" />
          <Line x1="16.5" y1="16.5" x2="21" y2="21" stroke={Colors.textMuted} strokeWidth="2" strokeLinecap="round" />
        </Svg>
        <TextInput
          style={styles.searchInput}
          placeholder="Search food items..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoFocus
        />
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'foods' && styles.tabActive]}
          onPress={() => setTab('foods')}
          activeOpacity={0.75}
        >
          <Text style={[styles.tabText, tab === 'foods' && styles.tabTextActive]}>Common Foods</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'recipes' && styles.tabActive]}
          onPress={() => setTab('recipes')}
          activeOpacity={0.75}
        >
          <Text style={[styles.tabText, tab === 'recipes' && styles.tabTextActive]}>My Recipes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tab === 'foods' && (
          <>
            {filteredFoods.length === 0 && (
              <Text style={styles.emptyText}>No results for "{search}"</Text>
            )}
            {filteredFoods.map((food, i) => (
              <TouchableOpacity key={i} style={styles.foodRow} onPress={() => onSelect(food)} activeOpacity={0.7}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodServing}>{food.serving}</Text>
                </View>
                <View style={styles.foodRight}>
                  <Text style={styles.foodCal}>{food.calories} kcal</Text>
                  <Text style={styles.foodMacros}>P {food.protein}g · C {food.carbs}g · F {food.fat}g</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {tab === 'recipes' && (
          <>
            {filteredRecipes.length === 0 && (
              <Text style={styles.emptyText}>No recipes found</Text>
            )}
            {filteredRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.foodRow}
                onPress={() => onSelect({
                  name: recipe.name,
                  serving: recipe.serving,
                  calories: recipe.calories,
                  protein: recipe.protein,
                  carbs: recipe.carbs,
                  fat: recipe.fat,
                })}
                activeOpacity={0.7}
              >
                <View style={[styles.recipeDot, { backgroundColor: recipe.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.foodName}>{recipe.name}</Text>
                  <Text style={styles.foodServing}>{recipe.serving}</Text>
                </View>
                <View style={styles.foodRight}>
                  <Text style={styles.foodCal}>{recipe.calories} kcal</Text>
                  <Text style={styles.foodMacros}>P {recipe.protein}g · C {recipe.carbs}g · F {recipe.fat}g</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: 3,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
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
  recipeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
  foodRight: {
    alignItems: 'flex-end',
  },
  foodCal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  foodMacros: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
