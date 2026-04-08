import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface GoalProgressProps {
  consumed: number;
  goal: number;
  daysRemaining: number;
  label: string;
}

export default function GoalProgress({
  consumed,
  goal,
  daysRemaining,
  label,
}: GoalProgressProps) {
  const pct = Math.min(consumed / goal, 1);
  const pctDisplay = Math.round((consumed / goal) * 100);
  const remaining = Math.max(0, goal - consumed);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.pct}>{pctDisplay}%</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pctDisplay}%` }]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.consumed}>
          {consumed.toLocaleString('en-IN')} kcal consumed
        </Text>
        <Text style={styles.target}>
          of {goal.toLocaleString('en-IN')} kcal
        </Text>
      </View>

      <View style={styles.breakdown}>
        <View style={styles.breakdownItem}>
          <View style={[styles.dot, { backgroundColor: Colors.accent }]} />
          <Text style={styles.breakdownText}>
            {remaining.toLocaleString('en-IN')} kcal remaining
          </Text>
        </View>
        <View style={styles.breakdownItem}>
          <View style={[styles.dot, { backgroundColor: Colors.textMuted }]} />
          <Text style={styles.breakdownText}>
            {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  pct: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.accent,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  consumed: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  target: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  breakdown: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  breakdownText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
