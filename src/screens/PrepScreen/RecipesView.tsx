import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { useRecipes, SavedRecipe } from '../../context/RecipeContext';
import RecipeSearchBar from './RecipeSearchBar';
import RecipeFilters from './RecipeFilters';
import RecipeCard from './RecipeCard';
import CreateRecipeModal from './CreateRecipeModal';
import RecipeDetailModal from './RecipeDetailModal';

export default function RecipesView() {
  const { recipes, deleteRecipe } = useRecipes();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailRecipe, setDetailRecipe] = useState<SavedRecipe | null>(null);
  const [editRecipe, setEditRecipe] = useState<SavedRecipe | null>(null);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesFilter =
      activeFilter === 'All' || recipe.tags.includes(activeFilter.toLowerCase());
    const matchesSearch =
      searchQuery === '' || recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  function handleEdit() {
    const recipe = detailRecipe;
    setDetailRecipe(null);
    setEditRecipe(recipe);
  }

  function handleDeleteFromDetail() {
    if (detailRecipe) {
      deleteRecipe(detailRecipe.id);
      setDetailRecipe(null);
    }
  }

  return (
    <View style={styles.container}>
      <RecipeSearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <RecipeFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filteredRecipes.length === 0 && (
          <Text style={styles.emptyText}>No recipes found</Text>
        )}
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
      </ScrollView>

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
        onEdit={handleEdit}
        onDelete={handleDeleteFromDetail}
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
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
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
