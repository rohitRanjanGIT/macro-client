import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface DaySummaryProps {
  planned: number;
  target: number;
  diff: number;
}

export default function DaySummary({ planned, target, diff }: DaySummaryProps) {
  return (
    <View style={styles.summaryRow}>
      <View style={[styles.summaryCard, styles.summaryBorder]}>
        <Text style={styles.summaryLabel}>Planned</Text>
        <Text style={styles.summaryValue}>{planned.toLocaleString()}</Text>
      </View>
      <View style={[styles.summaryCard, styles.summaryBorder]}>
        <Text style={styles.summaryLabel}>Target</Text>
        <Text style={styles.summaryValue}>{target.toLocaleString()}</Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Diff</Text>
        <Text
          style={[
            styles.summaryValue,
            { color: diff > 0 ? Colors.mealBreakfast : diff < 0 ? Colors.remaining : Colors.text },
          ]}
        >
          {diff > 0 ? '+' : ''}{diff}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  summaryBorder: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
});
