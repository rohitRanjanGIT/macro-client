import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { SavedCombo } from '../../context/ComboContext';

interface ComboRowProps {
  combo: SavedCombo;
  selected: boolean;
  onToggle: () => void;
}

function CheckIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12l5 5L20 7" stroke={Colors.background} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function ComboRow({ combo, selected, onToggle }: ComboRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, selected && styles.rowSelected]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.dot, { backgroundColor: combo.color }]} />
          <Text style={styles.name}>{combo.name}</Text>
        </View>
        <Text style={styles.items}>
          {combo.items.map(i => `${i.servings > 1 ? `${i.servings}× ` : ''}${i.name}`).join(', ')}
        </Text>
        <Text style={styles.macros}>P {combo.protein}g · C {combo.carbs}g · F {combo.fat}g</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.cal}>{combo.calories}</Text>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '30',
  },
  rowSelected: {
    backgroundColor: Colors.accent + '08',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 4,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  items: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 3,
    marginLeft: 18,
  },
  macros: {
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 18,
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
