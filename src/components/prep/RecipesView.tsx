import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import CreateRecipeModal from './CreateRecipeModal';
import { useRecipes, SavedRecipe } from '../../context/RecipeContext';

const FILTERS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

function RecipeCard({ recipe, onDelete }: { recipe: SavedRecipe; onDelete: () => void }) {
  return (
    <TouchableOpacity style={styles.recipeCard} activeOpacity={0.7}>
      <View style={styles.recipeHeader}>
        <View style={[styles.colorDot, { backgroundColor: recipe.color }]} />
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
          <Text style={styles.tagText}>{recipe.ingredients.length} ingredients</Text>
        </View>

        {/* Delete button — only for user-created recipes */}
        {recipe.id.startsWith('user-') && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={onDelete}
            hitSlop={8}
          >
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                stroke={Colors.danger}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function RecipesView() {
  const { recipes, deleteRecipe } = useRecipes();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const filteredRecipes = recipes.filter((recipe) => {
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
        {filteredRecipes.length === 0 && (
          <Text style={styles.emptyText}>No recipes found</Text>
        )}
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onDelete={() => deleteRecipe(recipe.id)}
          />
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
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  recipeCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
    marginLeft: 18,
  },
  recipeMacros: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 10,
    marginLeft: 18,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
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
  deleteBtn: {
    marginLeft: 'auto',
    padding: 4,
    backgroundColor: Colors.danger + '15',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.danger + '40',
  },
  createBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.accent + '60',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
});
