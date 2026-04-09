import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { Colors } from '../../constants/colors';

interface RecipeSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function RecipeSearchBar({ value, onChangeText }: RecipeSearchBarProps) {
  return (
    <View style={styles.searchBar}>
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="7" stroke={Colors.textMuted} strokeWidth="2" />
        <Line x1="16.5" y1="16.5" x2="21" y2="21" stroke={Colors.textMuted} strokeWidth="2" strokeLinecap="round" />
      </Svg>
      <TextInput
        style={styles.searchInput}
        placeholder="Search my recipes..."
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
  },
});
