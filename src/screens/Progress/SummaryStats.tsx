import React from 'react';
import { View, StyleSheet } from 'react-native';
import MetricCard from '../../components/MetricCard';
import { Colors } from '../../constants/colors';

interface SummaryStatsProps {
  avgCalories: string;
  daysOnTarget: string;
  daysTotal: string;
  bestDay: string;
  worstDay: string;
}

export default function SummaryStats({
  avgCalories = '2,069',
  daysOnTarget = '5',
  daysTotal = '/ 7',
  bestDay = '1,870',
  worstDay = '2,710',
}: SummaryStatsProps) {
  return (
    <View style={styles.grid}>
      <MetricCard label="Avg Daily Calories" value={avgCalories} unit="kcal" />
      <MetricCard label="Days on Target" value={daysOnTarget} unit={daysTotal} accent={Colors.accent} />
      <MetricCard label="Best Day" value={bestDay} unit="kcal" accent={Colors.accent} />
      <MetricCard label="Worst Day" value={worstDay} unit="kcal" accent={Colors.danger} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
});
