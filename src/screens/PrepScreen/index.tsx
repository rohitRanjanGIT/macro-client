import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import TabToggle from './TabToggle';
import RecipesView from './RecipesView';
import MealPlanView from './MealPlanView';

type Tab = 'recipes' | 'mealplan';

export default function PrepScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('recipes');

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>Prep</Text>
      <TabToggle activeTab={activeTab} onTabChange={setActiveTab} />
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
});
