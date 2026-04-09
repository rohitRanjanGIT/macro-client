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
import { useRecipes, RecipeIngredient, SavedRecipe, PALETTE } from '../../context/RecipeContext';
import NutritionCard from './NutritionCard';
import IngredientList from './IngredientList';
import IngredientSearch from './IngredientSearch';

const MEAL_TAGS = ['breakfast', 'lunch', 'dinner', 'snack', 'combo'];

const DEFAULT_INGREDIENTS: RecipeIngredient[] = [
  { id: 'i1', name: 'Kabuli chana (dried)', serving: '100g', qty: 2, calories: 340, protein: 19, carbs: 61, fat: 5 },
  { id: 'i2', name: 'Onion', serving: '1 medium (110g)', qty: 1, calories: 44, protein: 1, carbs: 10, fat: 0 },
  { id: 'i3', name: 'Tomato', serving: '1 medium (120g)', qty: 2, calories: 22, protein: 1, carbs: 5, fat: 0 },
  { id: 'i4', name: 'Oil (vegetable)', serving: '1 tbsp (14g)', qty: 2, calories: 124, protein: 0, carbs: 0, fat: 14 },
  { id: 'i5', name: 'Ginger garlic paste', serving: '1 tbsp (15g)', qty: 1, calories: 20, protein: 1, carbs: 4, fat: 0 },
  { id: 'i6', name: 'Spices mix', serving: '1 tsp (5g)', qty: 1, calories: 15, protein: 0, carbs: 3, fat: 0 },
];

interface CreateRecipeModalProps {
  visible: boolean;
  onClose: () => void;
  editRecipe?: SavedRecipe | null;
}

export default function CreateRecipeModal({ visible, onClose, editRecipe }: CreateRecipeModalProps) {
  const { addRecipe, updateRecipe } = useRecipes();
  const isEditing = !!editRecipe;

  const [recipeName, setRecipeName] = useState(editRecipe?.name ?? '');
  const [serves, setServes] = useState(editRecipe?.servings ?? 4);
  const [servingLabel, setServingLabel] = useState(editRecipe?.serving ?? '');
  const [selectedTags, setSelectedTags] = useState<string[]>(editRecipe?.tags ?? []);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(editRecipe?.ingredients ?? DEFAULT_INGREDIENTS);
  const [showIngSearch, setShowIngSearch] = useState(false);
  const [nameError, setNameError] = useState(false);

  // Reset form when editRecipe changes (open with new recipe or switch to create)
  React.useEffect(() => {
    if (visible) {
      setRecipeName(editRecipe?.name ?? '');
      setServes(editRecipe?.servings ?? 4);
      setServingLabel(editRecipe?.serving ?? '');
      setSelectedTags(editRecipe?.tags ?? []);
      setIngredients(editRecipe?.ingredients ?? DEFAULT_INGREDIENTS);
      setNameError(false);
      setShowIngSearch(false);
    }
  }, [visible, editRecipe]);

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

  function addIngredient(food: { name: string; serving: string; calories: number; protein: number; carbs: number; fat: number }) {
    const id = `i-${Date.now()}`;
    setIngredients(prev => [...prev, {
      id, name: food.name, serving: food.serving, qty: 1,
      calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat,
    }]);
    setShowIngSearch(false);
  }

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  function handleSave() {
    if (!recipeName.trim()) { setNameError(true); return; }
    const tags = selectedTags.length > 0 ? selectedTags : ['other'];
    const data = {
      name: recipeName.trim(),
      serving: servingLabel.trim() || '1 serving',
      servings: serves,
      calories: perServCal,
      protein: perServProt,
      carbs: perServCarb,
      fat: perServFat,
      tags,
      ingredients,
    };

    if (isEditing && editRecipe) {
      updateRecipe(editRecipe.id, data);
    } else {
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      addRecipe({ ...data, color });
    }
    onClose();
  }

  function handleClose() {
    setNameError(false);
    onClose();
  }

  if (showIngSearch) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowIngSearch(false)}>
        <IngredientSearch
          existingNames={ingredients.map(i => i.name)}
          onSelect={addIngredient}
          onBack={() => setShowIngSearch(false)}
        />
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{isEditing ? 'Edit recipe' : 'New recipe'}</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={12} style={styles.closeCircle}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>
          </View>

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

          <Text style={styles.fieldLabel}>SERVING DESCRIPTION</Text>
          <TextInput
            style={styles.nameInput}
            value={servingLabel}
            onChangeText={setServingLabel}
            placeholderTextColor={Colors.textMuted}
            placeholder="e.g. 1 katori (200g)"
            returnKeyType="done"
          />

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

          <NutritionCard
            perServCal={perServCal}
            perServProt={perServProt}
            perServCarb={perServCarb}
            perServFat={perServFat}
            totCal={totCal}
            serves={serves}
          />

          <IngredientList
            ingredients={ingredients}
            onAdjustQty={adjustQty}
            onRemove={removeIngredient}
            onAddNew={() => setShowIngSearch(true)}
          />

          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{isEditing ? 'Update recipe' : 'Save recipe'}</Text>
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
