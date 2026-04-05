import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Colors } from '../constants/colors';

export interface MealMacros {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

interface MealDetailModalProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  description: string;
  macros: MealMacros;
}

function MacroBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <View style={styles.macroBarRow}>
      <Text style={styles.macroBarLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.macroBarValue}>{value}g</Text>
    </View>
  );
}

export default function MealDetailModal({ visible, onClose, name, description, macros }: MealDetailModalProps) {
  const totalMacroGrams = macros.carbs + macros.protein + macros.fat;
  const carbsPct = totalMacroGrams > 0 ? Math.round((macros.carbs / totalMacroGrams) * 100) : 0;
  const proteinPct = totalMacroGrams > 0 ? Math.round((macros.protein / totalMacroGrams) * 100) : 0;
  const fatPct = 100 - carbsPct - proteinPct;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={() => {}}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{name}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Calorie count */}
          <View style={styles.calorieRow}>
            <Text style={styles.calorieValue}>{macros.calories}</Text>
            <Text style={styles.calorieUnit}> kcal</Text>
          </View>

          {/* Composition bar */}
          <Text style={styles.sectionLabel}>Composition</Text>
          <View style={styles.compositionBar}>
            <View style={[styles.compSegment, { flex: carbsPct, backgroundColor: Colors.calorieRingCarbs, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }]} />
            <View style={[styles.compSegment, { flex: proteinPct, backgroundColor: Colors.calorieRingProtein }]} />
            <View style={[styles.compSegment, { flex: fatPct, backgroundColor: Colors.calorieRingFat, borderTopRightRadius: 6, borderBottomRightRadius: 6 }]} />
          </View>
          <View style={styles.compositionLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.calorieRingCarbs }]} />
              <Text style={styles.legendText}>{carbsPct}% Carbs</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.calorieRingProtein }]} />
              <Text style={styles.legendText}>{proteinPct}% Protein</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.calorieRingFat }]} />
              <Text style={styles.legendText}>{fatPct}% Fat</Text>
            </View>
          </View>

          {/* Macro bars */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Macros</Text>
          <MacroBar label="Carbs" value={macros.carbs} max={80} color={Colors.calorieRingCarbs} />
          <MacroBar label="Protein" value={macros.protein} max={80} color={Colors.calorieRingProtein} />
          <MacroBar label="Fat" value={macros.fat} max={80} color={Colors.calorieRingFat} />
          {macros.fiber !== undefined && (
            <MacroBar label="Fiber" value={macros.fiber} max={30} color="#A78BFA" />
          )}
          {macros.sugar !== undefined && (
            <MacroBar label="Sugar" value={macros.sugar} max={50} color="#F472B6" />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    fontSize: 18,
    color: Colors.textMuted,
    padding: 4,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  calorieValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
  },
  calorieUnit: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  compositionBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 6,
    overflow: 'hidden',
    gap: 2,
    marginBottom: 10,
  },
  compSegment: {
    height: '100%',
  },
  compositionLegend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  macroBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  macroBarLabel: {
    width: 55,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  macroBarValue: {
    width: 40,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'right',
  },
});
