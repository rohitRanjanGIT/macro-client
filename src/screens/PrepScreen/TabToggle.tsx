import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';

type Tab = 'recipes' | 'mealplan';

interface TabToggleProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function TabToggle({ activeTab, onTabChange }: TabToggleProps) {
  return (
    <View style={styles.toggle}>
      <TouchableOpacity
        style={[styles.toggleBtn, activeTab === 'recipes' && styles.toggleBtnActive]}
        onPress={() => onTabChange('recipes')}
        activeOpacity={0.7}
      >
        <Text style={[styles.toggleText, activeTab === 'recipes' && styles.toggleTextActive]}>
          Recipes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleBtn, activeTab === 'mealplan' && styles.toggleBtnActive]}
        onPress={() => onTabChange('mealplan')}
        activeOpacity={0.7}
      >
        <Text style={[styles.toggleText, activeTab === 'mealplan' && styles.toggleTextActive]}>
          Meal plan
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
