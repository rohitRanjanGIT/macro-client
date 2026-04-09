import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { SavedRecipe } from '../../context/RecipeContext';

interface RecipeCardProps {
  recipe: SavedRecipe;
  onDelete: () => void;
  onLongPress: () => void;
}

export default function RecipeCard({ recipe, onDelete, onLongPress }: RecipeCardProps) {
  return (
    <TouchableOpacity style={styles.recipeCard} activeOpacity={0.7} onLongPress={onLongPress} delayLongPress={400}>
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

const styles = StyleSheet.create({
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
});
