import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { SavedRecipe } from '../../context/RecipeContext';
import NutritionCard from './NutritionCard';

interface RecipeDetailModalProps {
  recipe: SavedRecipe | null;
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function RecipeDetailModal({ recipe, visible, onClose, onEdit, onDelete }: RecipeDetailModalProps) {
  if (!recipe) return null;

  const totCal  = Math.round(recipe.ingredients.reduce((s, i) => s + i.calories * i.qty, 0));

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header with actions */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeCircle}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.editBtn} onPress={onEdit} activeOpacity={0.7}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                    stroke={Colors.accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                    stroke={Colors.accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} activeOpacity={0.7}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                    stroke={Colors.danger}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recipe title */}
          <View style={styles.titleRow}>
            <View style={[styles.colorDot, { backgroundColor: recipe.color }]} />
            <Text style={styles.title}>{recipe.name}</Text>
          </View>
          <Text style={styles.serving}>{recipe.serving}</Text>

          {/* Tags */}
          <View style={styles.tagRow}>
            {recipe.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Nutrition */}
          <Text style={styles.sectionLabel}>NUTRITION PER SERVING</Text>
          <NutritionCard
            perServCal={recipe.calories}
            perServProt={recipe.protein}
            perServCarb={recipe.carbs}
            perServFat={recipe.fat}
            totCal={totCal}
            serves={recipe.servings}
          />

          {/* Ingredients */}
          <View style={styles.ingHeader}>
            <Text style={styles.sectionLabel}>INGREDIENTS</Text>
            <Text style={styles.ingCount}>{recipe.ingredients.length}</Text>
          </View>
          {recipe.ingredients.map((ing) => {
            const ingCal = Math.round(ing.calories * ing.qty);
            return (
              <View key={ing.id} style={styles.ingredientRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ingredientName}>{ing.name}</Text>
                  <Text style={styles.ingredientAmount}>{ing.serving} · ×{ing.qty}</Text>
                </View>
                <Text style={styles.ingredientCal}>{ingCal} kcal</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  closeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.accent + '15',
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.danger + '15',
    borderWidth: 1,
    borderColor: Colors.danger + '40',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.danger,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  serving: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 14,
    marginLeft: 24,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 4,
  },
  ingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ingCount: {
    fontSize: 12,
    color: Colors.textMuted,
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border + '30',
  },
  ingredientName: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  ingredientAmount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  ingredientCal: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
});
