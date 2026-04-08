import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Colors } from '../constants/colors';

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
}

export default function MetricCard({ label, value, unit, accent }: MetricCardProps) {
  return (
    <Card style={styles.card} mode="contained">
      <Card.Content style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, accent ? { color: accent } : {}]}>
            {value}
          </Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    width: '48%',
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 6,
  },
  label: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  unit: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
