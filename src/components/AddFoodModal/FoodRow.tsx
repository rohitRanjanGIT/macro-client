import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { FoodItem } from './types';

interface FoodRowProps {
  item: FoodItem;
  selected: boolean;
  onToggle: () => void;
  colorDot?: string;
}

function CheckIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12l5 5L20 7" stroke={Colors.background} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function FoodRow({ item, selected, onToggle, colorDot }: FoodRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, selected && styles.rowSelected]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        {colorDot && <View style={[styles.dot, { backgroundColor: colorDot }]} />}
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.serving}>{item.serving}</Text>
          <Text style={styles.macros}>P {item.protein}g · C {item.carbs}g · F {item.fat}g</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.cal}>{item.calories}</Text>
        <Text style={styles.calLabel}>kcal</Text>
        <View style={[styles.circle, selected && styles.circleActive]}>
          {selected ? <CheckIcon /> : <Text style={styles.plus}>+</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '30',
  },
  rowSelected: {
    backgroundColor: Colors.accent + '08',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 4,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
  serving: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  macros: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
    marginLeft: 10,
    gap: 2,
  },
  cal: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  calLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  circleActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  plus: {
    fontSize: 16,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
