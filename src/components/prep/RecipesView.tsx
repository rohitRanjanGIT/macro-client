import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import CreateRecipeModal from './CreateRecipeModal';

interface Recipe {
  id: string;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: number;
  tags: string[];
}

const FILTERS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

const RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Chole (homemade)',
    serving: '1 katori (200g)',
    calories: 285,
    protein: 12,
    carbs: 34,
    fat: 10,
    ingredients: 6,
    tags: ['lunch', 'dinner'],
  },
  {
    id: '2',
    name: 'Morning oats combo',
    serving: 'oats + banana + honey + milk',
    calories: 360,
    protein: 14,
    carbs: 58,
    fat: 8,
    ingredients: 4,
    tags: ['breakfast', 'combo'],
  },
  {
    id: '3',
    name: 'Roti + dal + raita',
    serving: '2 roti + 1 katori + 1 sm bowl',
    calories: 565,
    protein: 28,
    carbs: 72,
    fat: 14,
    ingredients: 3,
    tags: ['dinner', 'combo'],
  },
];

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <TouchableOpacity style={styles.recipeCard} activeOpacity={0.7}>
      <View style={styles.recipeHeader}>
        <Text style={styles.recipeName}>{recipe.name}</Text>
        <View style={styles.recipeCal}>
          <Text style={styles.recipeCalNum}>{recipe.calories}</Text>
          <Text style={styles.recipeCalUnit}>kcal</Text>
        </View>
      </View>
      <Text style={styles.recipeServing}>{recipe.serving}</Text>
      <Text style={styles.recipeMacros}>
        P {recipe.protein}g    C {recipe.carbs}g    F {recipe.fat}g
      </Text>
      <View style={styles.tagRow}>
        {recipe.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        <View style={styles.tag}>
          <Text style={styles.tagText}>{recipe.ingredients} ingredients</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function RecipesView() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const filteredRecipes = RECIPES.filter((recipe) => {
    const matchesFilter =
      activeFilter === 'All' || recipe.tags.includes(activeFilter.toLowerCase());
    const matchesSearch =
      searchQuery === '' || recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchBar}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Circle cx="11" cy="11" r="7" stroke={Colors.textMuted} strokeWidth="2" />
          <Line x1="16.5" y1="16.5" x2="21" y2="21" stroke={Colors.textMuted} strokeWidth="2" strokeLinecap="round" />
        </Svg>
        <TextInput
          style={styles.searchInput}
          placeholder="Search my recipes..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter pills */}
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
            onPress={() => setActiveFilter(item)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recipe cards */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}

        {/* Create new recipe */}
        <TouchableOpacity
          style={styles.createBtn}
          activeOpacity={0.7}
          onPress={() => setCreateModalVisible(true)}
        >
          <Text style={styles.createBtnText}>+ Create new recipe</Text>
        </TouchableOpacity>
      </ScrollView>

      <CreateRecipeModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
  },
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
    transform: [{ scale: 1 }],
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.background,
  },
  listContent: {
    paddingBottom: 100,
  },
  recipeCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  recipeCal: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  recipeCalNum: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  recipeCalUnit: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  recipeServing: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  recipeMacros: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  createBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textMuted,
  },
});
