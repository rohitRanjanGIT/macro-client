import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { useRecipes, SavedRecipe } from '../../context/RecipeContext';
import { useCombos, SavedCombo } from '../../context/ComboContext';
import RecipeSearchBar from './RecipeSearchBar';
import RecipeFilters from './RecipeFilters';
import RecipeCard from './RecipeCard';
import ComboCard from './ComboCard';
import CreateRecipeModal from './CreateRecipeModal';
import RecipeDetailModal from './RecipeDetailModal';
import CreateComboModal from './CreateComboModal';
import ComboDetailModal from './ComboDetailModal';

export default function RecipesView() {
  const { recipes, deleteRecipe } = useRecipes();
  const { combos, deleteCombo } = useCombos();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Recipe modals
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailRecipe, setDetailRecipe] = useState<SavedRecipe | null>(null);
  const [editRecipe, setEditRecipe] = useState<SavedRecipe | null>(null);

  // Combo modals
  const [createComboVisible, setCreateComboVisible] = useState(false);
  const [detailCombo, setDetailCombo] = useState<SavedCombo | null>(null);
  const [editCombo, setEditCombo] = useState<SavedCombo | null>(null);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesFilter =
      activeFilter === 'All' || recipe.tags.includes(activeFilter.toLowerCase());
    const matchesSearch =
      searchQuery === '' || recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredCombos = combos.filter((combo) => {
    const matchesFilter =
      activeFilter === 'All' || combo.tags.includes(activeFilter.toLowerCase());
    const matchesSearch =
      searchQuery === '' || combo.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  function handleEditRecipe() {
    const recipe = detailRecipe;
    setDetailRecipe(null);
    setEditRecipe(recipe);
  }

  function handleDeleteRecipeFromDetail() {
    if (detailRecipe) {
      deleteRecipe(detailRecipe.id);
      setDetailRecipe(null);
    }
  }

  function handleEditCombo() {
    const combo = detailCombo;
    setDetailCombo(null);
    setEditCombo(combo);
  }

  function handleDeleteComboFromDetail() {
    if (detailCombo) {
      deleteCombo(detailCombo.id);
      setDetailCombo(null);
    }
  }

  return (
    <View style={styles.container}>
      <RecipeSearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <RecipeFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {/* Recipes */}
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onDelete={() => deleteRecipe(recipe.id)}
            onLongPress={() => setDetailRecipe(recipe)}
          />
        ))}
        <TouchableOpacity
          style={styles.createBtn}
          activeOpacity={0.7}
          onPress={() => setCreateModalVisible(true)}
        >
          <Text style={styles.createBtnText}>+ Create new recipe</Text>
        </TouchableOpacity>

        {/* Meal Combos section */}
        <Text style={styles.sectionLabel}>MEAL COMBOS</Text>
        {filteredCombos.length === 0 && filteredRecipes.length > 0 && (
          <Text style={styles.emptyText}>No combos yet</Text>
        )}
        {filteredCombos.map((combo) => (
          <ComboCard
            key={combo.id}
            combo={combo}
            onLongPress={() => setDetailCombo(combo)}
          />
        ))}
        <TouchableOpacity
          style={styles.comboBtn}
          activeOpacity={0.7}
          onPress={() => setCreateComboVisible(true)}
        >
          <Text style={styles.comboBtnText}>+ Club a meal</Text>
        </TouchableOpacity>

        {filteredRecipes.length === 0 && filteredCombos.length === 0 && (
          <Text style={styles.emptyText}>No results found</Text>
        )}
      </ScrollView>

      {/* Recipe modals */}
      <CreateRecipeModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
      <CreateRecipeModal
        visible={!!editRecipe}
        onClose={() => setEditRecipe(null)}
        editRecipe={editRecipe}
      />
      <RecipeDetailModal
        recipe={detailRecipe}
        visible={!!detailRecipe}
        onClose={() => setDetailRecipe(null)}
        onEdit={handleEditRecipe}
        onDelete={handleDeleteRecipeFromDetail}
      />

      {/* Combo modals */}
      <CreateComboModal
        visible={createComboVisible}
        onClose={() => setCreateComboVisible(false)}
      />
      <CreateComboModal
        visible={!!editCombo}
        onClose={() => setEditCombo(null)}
        editCombo={editCombo}
      />
      <ComboDetailModal
        combo={detailCombo}
        visible={!!detailCombo}
        onClose={() => setDetailCombo(null)}
        onEdit={handleEditCombo}
        onDelete={handleDeleteComboFromDetail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
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
  comboBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.calorieRingProtein + '60',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  comboBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.calorieRingProtein,
  },
});
