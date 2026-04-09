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
import { useCombos, ComboItem, SavedCombo, COMBO_PALETTE } from '../../context/ComboContext';
import ComboFoodPicker, { FoodOption } from './ComboFoodPicker';

const MEAL_TAGS = ['breakfast', 'lunch', 'dinner', 'snack', 'combo'];

interface CreateComboModalProps {
  visible: boolean;
  onClose: () => void;
  editCombo?: SavedCombo | null;
}

export default function CreateComboModal({ visible, onClose, editCombo }: CreateComboModalProps) {
  const { addCombo, updateCombo } = useCombos();
  const isEditing = !!editCombo;

  const [comboName, setComboName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [items, setItems] = useState<ComboItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [nameError, setNameError] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setComboName(editCombo?.name ?? '');
      setSelectedTags(editCombo?.tags ?? []);
      setItems(editCombo?.items ?? []);
      setNameError(false);
      setShowPicker(false);
    }
  }, [visible, editCombo]);

  const totCal  = Math.round(items.reduce((s, i) => s + i.calories * i.servings, 0));
  const totProt = Math.round(items.reduce((s, i) => s + i.protein  * i.servings, 0));
  const totCarb = Math.round(items.reduce((s, i) => s + i.carbs    * i.servings, 0));
  const totFat  = Math.round(items.reduce((s, i) => s + i.fat      * i.servings, 0));

  function addItem(food: FoodOption) {
    const id = `ci-${Date.now()}`;
    setItems(prev => [...prev, {
      id,
      name: food.name,
      serving: food.serving,
      servings: 1,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    }]);
    setShowPicker(false);
  }

  function adjustServings(id: string, delta: number) {
    setItems(prev =>
      prev.map(i => i.id === id
        ? { ...i, servings: Math.max(0.5, parseFloat((i.servings + delta).toFixed(1))) }
        : i
      )
    );
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  function handleSave() {
    if (!comboName.trim()) { setNameError(true); return; }
    if (items.length === 0) return;

    const tags = selectedTags.length > 0 ? selectedTags : ['combo'];
    const data = {
      name: comboName.trim(),
      color: editCombo?.color ?? COMBO_PALETTE[Math.floor(Math.random() * COMBO_PALETTE.length)],
      items,
      calories: totCal,
      protein: totProt,
      carbs: totCarb,
      fat: totFat,
      tags,
    };

    if (isEditing && editCombo) {
      updateCombo(editCombo.id, data);
    } else {
      addCombo(data);
    }
    onClose();
  }

  function handleClose() {
    setNameError(false);
    onClose();
  }

  if (showPicker) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowPicker(false)}>
        <ComboFoodPicker
          existingNames={items.map(i => i.name)}
          onSelect={addItem}
          onBack={() => setShowPicker(false)}
        />
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{isEditing ? 'Edit combo' : 'Club a meal'}</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={12} style={styles.closeCircle}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Combine different food items into one meal
          </Text>

          {/* Combo name */}
          <Text style={styles.fieldLabel}>COMBO NAME</Text>
          <TextInput
            style={[styles.nameInput, nameError && styles.nameInputError]}
            value={comboName}
            onChangeText={t => { setComboName(t); setNameError(false); }}
            placeholderTextColor={Colors.textMuted}
            placeholder="e.g. Dinner thali, Lunch plate"
            returnKeyType="done"
          />
          {nameError && <Text style={styles.fieldError}>Please enter a name</Text>}

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

          {/* Running total */}
          {items.length > 0 && (
            <View style={styles.totalCard}>
              <View style={styles.totalHeader}>
                <View>
                  <Text style={styles.totalCalBig}>{totCal}</Text>
                  <Text style={styles.totalCalLabel}>kcal total</Text>
                </View>
                <View style={styles.macroBadges}>
                  {[
                    { label: 'P', val: totProt, color: Colors.calorieRingProtein },
                    { label: 'C', val: totCarb, color: Colors.calorieRingCarbs },
                    { label: 'F', val: totFat,  color: Colors.calorieRingFat },
                  ].map(m => (
                    <View key={m.label} style={[styles.macroBadge, { borderColor: m.color + '60' }]}>
                      <Text style={[styles.macroBadgeVal, { color: m.color }]}>{m.val}g</Text>
                      <Text style={styles.macroBadgeLbl}>{m.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Food items */}
          <View style={styles.itemsHeader}>
            <Text style={styles.fieldLabel}>FOOD ITEMS</Text>
            {items.length > 0 && (
              <Text style={styles.itemCount}>{items.length}</Text>
            )}
          </View>

          {items.length === 0 && (
            <Text style={styles.emptyHint}>
              Add food items you want to club together
            </Text>
          )}

          {items.map((item) => {
            const itemCal = Math.round(item.calories * item.servings);
            return (
              <View key={item.id} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemServing}>{item.serving} · {itemCal} kcal</Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity onPress={() => adjustServings(item.id, -0.5)} hitSlop={6} style={styles.stepBtn}>
                    <Text style={styles.stepTxt}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepQty}>×{item.servings}</Text>
                  <TouchableOpacity onPress={() => adjustServings(item.id, 0.5)} hitSlop={6} style={styles.stepBtn}>
                    <Text style={styles.stepTxt}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)} hitSlop={10} style={styles.removeBtn}>
                  <Text style={styles.removeTxt}>✕</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Add item button */}
          <TouchableOpacity style={styles.addItemBtn} activeOpacity={0.7} onPress={() => setShowPicker(true)}>
            <Text style={styles.addItemText}>+ Add food item</Text>
          </TouchableOpacity>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, items.length === 0 && styles.saveBtnDisabled]}
            activeOpacity={items.length === 0 ? 1 : 0.85}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>{isEditing ? 'Update combo' : 'Save combo'}</Text>
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
    marginBottom: 6,
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
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 20,
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
  totalCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border + '50',
  },
  totalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalCalBig: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  totalCalLabel: {
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
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemCount: {
    fontSize: 12,
    color: Colors.textMuted,
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  emptyHint: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  itemRow: {
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
  itemName: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemServing: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 8,
    overflow: 'hidden',
  },
  stepBtn: {
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  stepTxt: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  stepQty: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 28,
    textAlign: 'center',
  },
  removeBtn: {
    padding: 5,
    borderRadius: 6,
    backgroundColor: Colors.cardBackgroundLight,
  },
  removeTxt: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  addItemBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.accent + '50',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  addItemText: {
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
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
});
