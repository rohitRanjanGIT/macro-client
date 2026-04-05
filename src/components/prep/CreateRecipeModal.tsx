import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Colors } from '../../constants/colors';

interface Ingredient {
  name: string;
  amount: string;
}

interface CreateRecipeModalProps {
  visible: boolean;
  onClose: () => void;
}

const INITIAL_INGREDIENTS: Ingredient[] = [
  { name: 'Kabuli chana (dried)', amount: '200g' },
  { name: 'Onion (chopped)', amount: '100g' },
  { name: 'Tomato (pureed)', amount: '150g' },
  { name: 'Oil', amount: '2 tbsp' },
  { name: 'Ginger garlic paste', amount: '1 tbsp' },
  { name: 'Spices (chole masala)', amount: '1 tbsp' },
];

export default function CreateRecipeModal({ visible, onClose }: CreateRecipeModalProps) {
  const [recipeName, setRecipeName] = useState('Chole (homemade)');
  const [serves, setServes] = useState(4);
  const [ingredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);

  // Mock nutrition per serving
  const perServing = {
    calories: 285,
    protein: 12,
    carbs: 34,
    fat: 10,
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>New recipe</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeCircle}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Recipe name */}
          <Text style={styles.fieldLabel}>Recipe name</Text>
          <TextInput
            style={styles.nameInput}
            value={recipeName}
            onChangeText={setRecipeName}
            placeholderTextColor={Colors.textMuted}
            placeholder="Enter recipe name"
          />

          {/* Serves */}
          <Text style={styles.fieldLabel}>Serves</Text>
          <View style={styles.servesRow}>
            <TouchableOpacity
              style={styles.servesBtn}
              onPress={() => setServes((s) => Math.max(1, s - 1))}
              activeOpacity={0.7}
            >
              <Text style={styles.servesBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.servesValue}>
              <Text style={styles.servesNum}>{serves}</Text>
            </View>
            <TouchableOpacity
              style={styles.servesBtn}
              onPress={() => setServes((s) => s + 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.servesBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Ingredients */}
          <Text style={styles.fieldLabel}>Ingredients</Text>
          {ingredients.map((ing, index) => (
            <View key={index} style={styles.ingredientRow}>
              <Text style={styles.ingredientName}>{ing.name}</Text>
              <Text style={styles.ingredientAmount}>{ing.amount}</Text>
            </View>
          ))}

          {/* Add ingredient */}
          <TouchableOpacity style={styles.addIngredientBtn} activeOpacity={0.7}>
            <Text style={styles.addIngredientText}>+ Add ingredient</Text>
          </TouchableOpacity>

          {/* Per serving summary */}
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionLabel}>
              Per serving (1 of {serves})
            </Text>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionCal}>{perServing.calories} kcal</Text>
              <Text style={styles.nutritionMacros}>
                P {perServing.protein}g  C {perServing.carbs}g  F{'\n'}{perServing.fat}g
              </Text>
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.7} onPress={onClose}>
            <Text style={styles.saveBtnText}>Save recipe</Text>
          </TouchableOpacity>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
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
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 20,
  },
  servesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  servesBtn: {
    width: 40,
    height: 40,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servesBtnText: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.text,
  },
  servesValue: {
    width: 48,
    height: 40,
    backgroundColor: Colors.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servesNum: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 6,
  },
  ingredientName: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  ingredientAmount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
  },
  addIngredientBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  addIngredientText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  nutritionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  nutritionLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutritionCal: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  nutritionMacros: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'right',
    lineHeight: 18,
  },
  saveBtn: {
    backgroundColor: Colors.text,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
});
