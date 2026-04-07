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
import Svg, { Line, Circle } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { useRecipes, RecipeIngredient, PALETTE } from '../../context/RecipeContext';

// ─── Ingredient pool ──────────────────────────────────────────────────────────

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

const MEAL_TAGS = ['breakfast', 'lunch', 'dinner', 'snack', 'combo'];

interface CreateRecipeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreateRecipeModal({ visible, onClose }: CreateRecipeModalProps) {
  const { addRecipe } = useRecipes();

  const [recipeName, setRecipeName] = useState('');
  const [serves, setServes] = useState(4);
  const [servingLabel, setServingLabel] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { id: 'i1', name: 'Kabuli chana (dried)', serving: '100g', qty: 2, calories: 340, protein: 19, carbs: 61, fat: 5 },
    { id: 'i2', name: 'Onion', serving: '1 medium (110g)', qty: 1, calories: 44, protein: 1, carbs: 10, fat: 0 },
    { id: 'i3', name: 'Tomato', serving: '1 medium (120g)', qty: 2, calories: 22, protein: 1, carbs: 5, fat: 0 },
    { id: 'i4', name: 'Oil (vegetable)', serving: '1 tbsp (14g)', qty: 2, calories: 124, protein: 0, carbs: 0, fat: 14 },
    { id: 'i5', name: 'Ginger garlic paste', serving: '1 tbsp (15g)', qty: 1, calories: 20, protein: 1, carbs: 4, fat: 0 },
    { id: 'i6', name: 'Spices mix', serving: '1 tsp (5g)', qty: 1, calories: 15, protein: 0, carbs: 3, fat: 0 },
  ]);
  const [showIngSearch, setShowIngSearch] = useState(false);
  const [ingSearch, setIngSearch] = useState('');
  const [nameError, setNameError] = useState(false);

  // Live totals
  const totCal  = Math.round(ingredients.reduce((s, i) => s + i.calories * i.qty, 0));
  const totProt = Math.round(ingredients.reduce((s, i) => s + i.protein  * i.qty, 0));
  const totCarb = Math.round(ingredients.reduce((s, i) => s + i.carbs    * i.qty, 0));
  const totFat  = Math.round(ingredients.reduce((s, i) => s + i.fat      * i.qty, 0));

  const perServCal  = Math.round(totCal  / Math.max(1, serves));
  const perServProt = Math.round(totProt / Math.max(1, serves));
  const perServCarb = Math.round(totCarb / Math.max(1, serves));
  const perServFat  = Math.round(totFat  / Math.max(1, serves));

  function adjustQty(id: string, delta: number) {
    setIngredients(prev =>
      prev.map(i => i.id === id
        ? { ...i, qty: Math.max(0.5, parseFloat((i.qty + delta).toFixed(1))) }
        : i
      )
    );
  }

  function removeIngredient(id: string) {
    setIngredients(prev => prev.filter(i => i.id !== id));
  }

  function addIngredient(food: FoodEntry) {
    const id = `i-${Date.now()}`;
    setIngredients(prev => [...prev, {
      id, name: food.name, serving: food.serving, qty: 1,
      calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat,
    }]);
    setShowIngSearch(false);
    setIngSearch('');
  }

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  function handleSave() {
    if (!recipeName.trim()) { setNameError(true); return; }
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    addRecipe({
      name: recipeName.trim(),
      serving: servingLabel.trim() || `1 serving`,
      servings: serves,
      calories: perServCal,
      protein: perServProt,
      carbs: perServCarb,
      fat: perServFat,
      color,
      tags: selectedTags.length > 0 ? selectedTags : ['other'],
      ingredients,
    });
    // Reset form
    setRecipeName('');
    setServes(4);
    setServingLabel('');
    setSelectedTags([]);
    setNameError(false);
    onClose();
  }

  function handleClose() {
    setNameError(false);
    onClose();
  }

  const filteredPool = FOOD_DB.filter(
    f => f.name.toLowerCase().includes(ingSearch.toLowerCase()) &&
         !ingredients.find(i => i.name === f.name)
  );

  // ── Ingredient search overlay ──
  if (showIngSearch) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowIngSearch(false)}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => { setShowIngSearch(false); setIngSearch(''); }} hitSlop={12}>
              <Text style={styles.backBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Add ingredient</Text>
          </View>
          <View style={styles.searchBarIng}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Circle cx="11" cy="11" r="7" stroke={Colors.textMuted} strokeWidth="2" />
              <Line x1="16.5" y1="16.5" x2="21" y2="21" stroke={Colors.textMuted} strokeWidth="2" strokeLinecap="round" />
            </Svg>
            <TextInput
              style={styles.searchInput}
              placeholder="Search ingredient..."
              placeholderTextColor={Colors.textMuted}
              value={ingSearch}
              onChangeText={setIngSearch}
              autoFocus
            />
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {filteredPool.length === 0 && (
              <Text style={styles.emptyText}>No results for "{ingSearch}"</Text>
            )}
            {filteredPool.map((food, i) => (
              <TouchableOpacity key={i} style={styles.ingredientRow} onPress={() => addIngredient(food)} activeOpacity={0.7}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ingredientName}>{food.name}</Text>
                  <Text style={styles.ingredientAmount}>{food.serving}</Text>
                </View>
                <Text style={styles.ingCal}>{food.calories} kcal</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    );
  }

  // ── Main builder ──
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>New recipe</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={12} style={styles.closeCircle}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Recipe name */}
          <Text style={styles.fieldLabel}>RECIPE NAME</Text>
          <TextInput
            style={[styles.nameInput, nameError && styles.nameInputError]}
            value={recipeName}
            onChangeText={t => { setRecipeName(t); setNameError(false); }}
            placeholderTextColor={Colors.textMuted}
            placeholder="e.g. Mum's Chole"
            returnKeyType="done"
          />
          {nameError && <Text style={styles.fieldError}>Please enter a recipe name</Text>}

          {/* Serving label */}
          <Text style={styles.fieldLabel}>SERVING DESCRIPTION</Text>
          <TextInput
            style={styles.nameInput}
            value={servingLabel}
            onChangeText={setServingLabel}
            placeholderTextColor={Colors.textMuted}
            placeholder="e.g. 1 katori (200g)"
            returnKeyType="done"
          />

          {/* Serves stepper */}
          <Text style={styles.fieldLabel}>TOTAL SERVINGS</Text>
          <View style={styles.servesRow}>
            <TouchableOpacity style={styles.servesBtn} onPress={() => setServes(s => Math.max(1, s - 1))} activeOpacity={0.7}>
              <Text style={styles.servesBtnText}>−</Text>
            </TouchableOpacity>
            <View style={styles.servesValue}>
              <Text style={styles.servesNum}>{serves}</Text>
            </View>
            <TouchableOpacity style={styles.servesBtn} onPress={() => setServes(s => s + 1)} activeOpacity={0.7}>
              <Text style={styles.servesBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Tags */}
          <Text style={styles.fieldLabel}>MEAL TAGS</Text>
          <View style={styles.tagRow}>
            {MEAL_TAGS.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[styles.tagPill, selectedTags.includes(tag) && styles.tagPillActive]}
                onPress={() => toggleTag(tag)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tagPillText, selectedTags.includes(tag) && styles.tagPillTextActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Live nutrition card */}
          <View style={styles.nutritionCard}>
            <View style={styles.nutritionCardHeader}>
              <View>
                <Text style={styles.nutritionCalBig}>{perServCal}</Text>
                <Text style={styles.nutritionCalLabel}>kcal / serving</Text>
              </View>
              <View style={styles.macroBadges}>
                {[
                  { label: 'P', val: perServProt, color: Colors.calorieRingProtein },
                  { label: 'C', val: perServCarb, color: Colors.calorieRingCarbs },
                  { label: 'F', val: perServFat,  color: Colors.calorieRingFat },
                ].map(m => (
                  <View key={m.label} style={[styles.macroBadge, { borderColor: m.color + '60' }]}>
                    <Text style={[styles.macroBadgeVal, { color: m.color }]}>{m.val}g</Text>
                    <Text style={styles.macroBadgeLbl}>{m.label}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.nutritionDivider} />
            <Text style={styles.nutritionTotal}>
              Total recipe: {totCal} kcal for {serves} serving{serves !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Ingredients */}
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
                  <TouchableOpacity onPress={() => adjustQty(ing.id, -0.5)} hitSlop={6} style={styles.ingStepBtn}>
                    <Text style={styles.ingStepTxt}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.ingQty}>×{ing.qty}</Text>
                  <TouchableOpacity onPress={() => adjustQty(ing.id, 0.5)} hitSlop={6} style={styles.ingStepBtn}>
                    <Text style={styles.ingStepTxt}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeIngredient(ing.id)} hitSlop={10} style={styles.ingRemove}>
                  <Text style={styles.ingRemoveTxt}>✕</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Add ingredient */}
          <TouchableOpacity style={styles.addIngredientBtn} activeOpacity={0.7} onPress={() => setShowIngSearch(true)}>
            <Text style={styles.addIngredientText}>+ Add ingredient</Text>
          </TouchableOpacity>

          {/* Save button */}
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
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
    paddingBottom: 48,
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
  backBtn: {
    fontSize: 15,
    color: Colors.accent,
    fontWeight: '600',
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
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  fieldError: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: -8,
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border + '60',
  },
  nameInputError: {
    borderColor: Colors.danger + '80',
  },
  servesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  tagPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  tagPillActive: {
    backgroundColor: Colors.accent + '20',
    borderColor: Colors.accent + '80',
  },
  tagPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  tagPillTextActive: {
    color: Colors.accent,
    fontWeight: '600',
  },
  nutritionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border + '50',
  },
  nutritionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutritionCalBig: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  nutritionCalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  macroBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  macroBadge: {
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    minWidth: 42,
  },
  macroBadgeVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  macroBadgeLbl: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  nutritionDivider: {
    height: 1,
    backgroundColor: Colors.border + '40',
    marginVertical: 10,
  },
  nutritionTotal: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  ingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  ingCal: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
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
  searchBarIng: {
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
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
});
