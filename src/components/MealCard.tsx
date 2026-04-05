import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface MealCardProps {
  type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  name: string;
  description: string;
  calories: number;
  onPress?: () => void;
  onLongPress?: () => void;
}

const mealColors = {
  breakfast: Colors.mealBreakfast,
  lunch: Colors.mealLunch,
  snack: Colors.mealSnack,
  dinner: Colors.mealDinner,
};

const mealIcons = {
  breakfast: (color: string) => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    </Svg>
  ),
  lunch: (color: string) => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 7h16M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  snack: (color: string) => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3l2 7h7l-5.5 4 2 7L12 17l-5.5 4 2-7L3 10h7l2-7z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  dinner: (color: string) => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3v18M3 12h18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  ),
};

export default function MealCard({ type, name, description, calories, onPress, onLongPress }: MealCardProps) {
  const color = mealColors[type];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} onLongPress={onLongPress} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        {mealIcons[type](color)}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.calories}>{calories}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  calories: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});
