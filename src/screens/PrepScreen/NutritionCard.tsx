import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface NutritionCardProps {
  perServCal: number;
  perServProt: number;
  perServCarb: number;
  perServFat: number;
  totCal: number;
  serves: number;
}

export default function NutritionCard({ perServCal, perServProt, perServCarb, perServFat, totCal, serves }: NutritionCardProps) {
  const macros = [
    { label: 'P', val: perServProt, color: Colors.calorieRingProtein },
    { label: 'C', val: perServCarb, color: Colors.calorieRingCarbs },
    { label: 'F', val: perServFat,  color: Colors.calorieRingFat },
  ];

  return (
    <View style={styles.nutritionCard}>
      <View style={styles.header}>
        <View>
          <Text style={styles.calBig}>{perServCal}</Text>
          <Text style={styles.calLabel}>kcal / serving</Text>
        </View>
        <View style={styles.macroBadges}>
          {macros.map(m => (
            <View key={m.label} style={[styles.macroBadge, { borderColor: m.color + '60' }]}>
              <Text style={[styles.macroBadgeVal, { color: m.color }]}>{m.val}g</Text>
              <Text style={styles.macroBadgeLbl}>{m.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.divider} />
      <Text style={styles.total}>
        Total recipe: {totCal} kcal for {serves} serving{serves !== 1 ? 's' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nutritionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border + '50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calBig: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  calLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  macroBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  macroBadge: {
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    minWidth: 42,
  },
  macroBadgeVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  macroBadgeLbl: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border + '40',
    marginVertical: 10,
  },
  total: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
