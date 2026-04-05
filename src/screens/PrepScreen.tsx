import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import RecipesView from '../components/prep/RecipesView';
import MealPlanView from '../components/prep/MealPlanView';

type Tab = 'recipes' | 'mealplan';

export default function PrepScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('recipes');

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Title */}
      <Text style={styles.title}>Prep</Text>

      {/* Segmented toggle */}
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, activeTab === 'recipes' && styles.toggleBtnActive]}
          onPress={() => setActiveTab('recipes')}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleText, activeTab === 'recipes' && styles.toggleTextActive]}>
            Recipes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, activeTab === 'mealplan' && styles.toggleBtnActive]}
          onPress={() => setActiveTab('mealplan')}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleText, activeTab === 'mealplan' && styles.toggleTextActive]}>
            Meal plan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'recipes' ? <RecipesView /> : <MealPlanView />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: 3,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  toggleTextActive: {
    color: Colors.text,
  },
});
