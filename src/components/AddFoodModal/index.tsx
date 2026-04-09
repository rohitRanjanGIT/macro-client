import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { useRecipes } from '../../context/RecipeContext';
import { useCombos, SavedCombo } from '../../context/ComboContext';
import { FoodItem, SelectedItem, TabKey, FilterKey, recentFoods } from './types';
import SearchBar from './SearchBar';
import TabBar from './TabBar';
import MealFilters from './MealFilters';
import FoodRow from './FoodRow';
import ComboRow from './ComboRow';
import SelectionTray from './SelectionTray';

interface AddFoodModalProps {
  visible: boolean;
  onClose: () => void;
  mealType: string;
  onVoicePress?: () => void;
  onCameraPress?: () => void;
}

export default function AddFoodModal({ visible, onClose, mealType, onVoicePress, onCameraPress }: AddFoodModalProps) {
  const { recipes } = useRecipes();
  const { combos } = useCombos();

  const [tab, setTab] = useState<TabKey>('recent');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [selected, setSelected] = useState<SelectedItem[]>([]);

  useEffect(() => {
    if (visible) {
      setTab('recent');
      setSearch('');
      setFilter('all');
      setSelected([]);
    }
  }, [visible]);

  // ── Filtering ──
  const q = search.toLowerCase();
  const matchesTag = (tags?: string[]) => filter === 'all' || (tags ?? []).includes(filter);

  const filteredRecent = recentFoods.filter(f => f.name.toLowerCase().includes(q) && matchesTag(f.tags));
  const filteredRecipes = recipes.filter(r => r.name.toLowerCase().includes(q) && matchesTag(r.tags));
  const filteredCombos = combos.filter(c =>
    (c.name.toLowerCase().includes(q) || c.items.some(i => i.name.toLowerCase().includes(q))) && matchesTag(c.tags)
  );

  // ── Selection ──
  const selectedIds = new Set(selected.map(s => s.id));

  function toggleFood(item: FoodItem) {
    if (selectedIds.has(item.id)) {
      setSelected(prev => prev.filter(s => s.id !== item.id));
    } else {
      setSelected(prev => [...prev, { ...item, servings: 1 }]);
    }
  }

  function toggleCombo(combo: SavedCombo) {
    const cid = `combo-${combo.id}`;
    if (selectedIds.has(cid)) {
      setSelected(prev => prev.filter(s => s.id !== cid));
    } else {
      setSelected(prev => [...prev, {
        id: cid, name: combo.name,
        serving: combo.items.map(i => i.name).join(', '),
        calories: combo.calories, protein: combo.protein,
        carbs: combo.carbs, fat: combo.fat, servings: 1,
      }]);
    }
  }

  function adjustServing(id: string, delta: number) {
    setSelected(prev => prev.map(s =>
      s.id === id ? { ...s, servings: Math.max(0.5, parseFloat((s.servings + delta).toFixed(1))) } : s
    ));
  }

  function removeItem(id: string) {
    setSelected(prev => prev.filter(s => s.id !== id));
  }

  function handleConfirm() {
    // TODO: persist selected items to meal state
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add to {mealType.toLowerCase()}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>

        <SearchBar value={search} onChangeText={setSearch} onCameraPress={onCameraPress} onVoicePress={onVoicePress} />
        <TabBar active={tab} onChange={setTab} />
        <MealFilters active={filter} onChange={setFilter} />

        {/* Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: selected.length > 0 ? 220 : 40 }}
        >
          {tab === 'recent' && (
            filteredRecent.length === 0
              ? <Text style={styles.emptyText}>No results for "{search}"</Text>
              : filteredRecent.map(food => (
                  <FoodRow key={food.id} item={food} selected={selectedIds.has(food.id)} onToggle={() => toggleFood(food)} />
                ))
          )}

          {tab === 'recipes' && (
            filteredRecipes.length === 0
              ? <Text style={styles.emptyText}>No results for "{search}"</Text>
              : filteredRecipes.map(recipe => {
                  const item: FoodItem = {
                    id: recipe.id, name: recipe.name, serving: recipe.serving,
                    calories: recipe.calories, protein: recipe.protein, carbs: recipe.carbs, fat: recipe.fat,
                  };
                  return (
                    <FoodRow key={recipe.id} item={item} selected={selectedIds.has(recipe.id)} onToggle={() => toggleFood(item)} colorDot={recipe.color} />
                  );
                })
          )}

          {tab === 'combos' && (
            filteredCombos.length === 0
              ? <Text style={styles.emptyText}>No results for "{search}"</Text>
              : filteredCombos.map(combo => (
                  <ComboRow key={combo.id} combo={combo} selected={selectedIds.has(`combo-${combo.id}`)} onToggle={() => toggleCombo(combo)} />
                ))
          )}
        </ScrollView>

        {selected.length > 0 && (
          <SelectionTray items={selected} onRemove={removeItem} onAdjust={adjustServing} onConfirm={handleConfirm} />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  closeBtn: {
    fontSize: 20,
    color: Colors.textMuted,
    padding: 4,
  },
  list: {
    flex: 1,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
});
