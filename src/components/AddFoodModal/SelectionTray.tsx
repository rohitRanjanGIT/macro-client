import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { SelectedItem } from './types';

interface SelectionTrayProps {
  items: SelectedItem[];
  onRemove: (id: string) => void;
  onAdjust: (id: string, delta: number) => void;
  onConfirm: () => void;
}

export default function SelectionTray({ items, onRemove, onAdjust, onConfirm }: SelectionTrayProps) {
  const totalCal = items.reduce((s, i) => s + Math.round(i.calories * i.servings), 0);
  const totalP = items.reduce((s, i) => s + Math.round(i.protein * i.servings), 0);
  const totalC = items.reduce((s, i) => s + Math.round(i.carbs * i.servings), 0);
  const totalF = items.reduce((s, i) => s + Math.round(i.fat * i.servings), 0);

  return (
    <View style={styles.tray}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {items.map(item => (
          <View key={item.id} style={styles.item}>
            <TouchableOpacity onPress={() => onRemove(item.id)} hitSlop={8}>
              <Text style={styles.remove}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => onAdjust(item.id, -0.5)} hitSlop={6}>
                <Text style={styles.stepBtn}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{item.servings}</Text>
              <TouchableOpacity onPress={() => onAdjust(item.id, 0.5)} hitSlop={6}>
                <Text style={styles.stepBtn}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.itemCal}>{Math.round(item.calories * item.servings)}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.summary}>
        <View style={styles.summaryLeft}>
          <Text style={styles.sumCal}>{totalCal} kcal</Text>
          <Text style={styles.sumMacros}>P {totalP}g · C {totalC}g · F {totalF}g</Text>
        </View>
        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.85}>
          <Text style={styles.confirmText}>Add {items.length} item{items.length !== 1 ? 's' : ''}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
    maxHeight: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  scroll: {
    maxHeight: 140,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 10,
  },
  remove: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  name: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 8,
    overflow: 'hidden',
  },
  stepBtn: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qty: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  itemCal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    minWidth: 36,
    textAlign: 'right',
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border + '40',
    paddingTop: 12,
  },
  summaryLeft: {
    flex: 1,
  },
  sumCal: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  sumMacros: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  confirmBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.background,
  },
});
