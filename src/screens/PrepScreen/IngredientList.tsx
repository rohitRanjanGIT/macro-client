import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { RecipeIngredient } from '../../context/RecipeContext';

interface IngredientListProps {
  ingredients: RecipeIngredient[];
  onAdjustQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onAddNew: () => void;
}

export default function IngredientList({ ingredients, onAdjustQty, onRemove, onAddNew }: IngredientListProps) {
  return (
    <>
      <View style={styles.ingHeader}>
        <Text style={styles.fieldLabel}>INGREDIENTS</Text>
        <Text style={styles.ingCount}>{ingredients.length}</Text>
      </View>

      {ingredients.map((ing) => {
        const ingCal = Math.round(ing.calories * ing.qty);
        return (
          <View key={ing.id} style={styles.ingredientRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.ingredientName}>{ing.name}</Text>
              <Text style={styles.ingredientAmount}>{ing.serving} · {ingCal} kcal</Text>
            </View>
            <View style={styles.ingStepper}>
              <TouchableOpacity onPress={() => onAdjustQty(ing.id, -0.5)} hitSlop={6} style={styles.ingStepBtn}>
                <Text style={styles.ingStepTxt}>−</Text>
              </TouchableOpacity>
              <Text style={styles.ingQty}>×{ing.qty}</Text>
              <TouchableOpacity onPress={() => onAdjustQty(ing.id, 0.5)} hitSlop={6} style={styles.ingStepBtn}>
                <Text style={styles.ingStepTxt}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => onRemove(ing.id)} hitSlop={10} style={styles.ingRemove}>
              <Text style={styles.ingRemoveTxt}>✕</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity style={styles.addIngredientBtn} activeOpacity={0.7} onPress={onAddNew}>
        <Text style={styles.addIngredientText}>+ Add ingredient</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  ingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginTop: 4,
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
    gap: 8,
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
  ingStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 8,
    overflow: 'hidden',
  },
  ingStepBtn: {
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  ingStepTxt: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  ingQty: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 28,
    textAlign: 'center',
  },
  ingRemove: {
    padding: 5,
    borderRadius: 6,
    backgroundColor: Colors.cardBackgroundLight,
  },
  ingRemoveTxt: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  addIngredientBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.accent + '50',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  addIngredientText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
});
