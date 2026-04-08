import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Colors } from '../../constants/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface MacroGraphProps {
  data: { day: string; protein: number; carbs: number; fat: number }[];
}

export default function MacroGraph({ data }: MacroGraphProps) {
  // Find highest macro value across all days to set Y-axis scale
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.protein, d.carbs, d.fat)),
    100
  );
  const CHART_HEIGHT = 160;

  return (
    <Card style={styles.card} mode="contained">
      <Card.Content style={styles.content}>
        <Text style={styles.title}>Daily Macro Intake</Text>
        
        <View style={styles.chartContainer}>
          {/* Y-axis Labels */}
          <View style={styles.yAxis}>
            <Text style={styles.yLabel}>{Math.round(maxVal)}g</Text>
            <Text style={styles.yLabel}>{Math.round(maxVal / 2)}g</Text>
            <Text style={styles.yLabel}>0g</Text>
          </View>

          {/* Chart Area */}
          <View style={styles.chartArea}>
            {/* Background grid lines */}
            <View style={[styles.gridLine, { top: 0 }]} />
            <View style={[styles.gridLine, { top: CHART_HEIGHT / 2 }]} />
            <View style={[styles.gridLine, { top: CHART_HEIGHT }]} />

            {/* Bars */}
            <View style={styles.barsContainer}>
              {data.map((d) => (
                <View key={d.day} style={styles.dayGroup}>
                  {/* Protein Bar */}
                  <View
                    style={[
                      styles.bar,
                      { backgroundColor: Colors.calorieRingProtein },
                      { height: (d.protein / maxVal) * CHART_HEIGHT },
                    ]}
                  />
                  {/* Carbs Bar */}
                  <View
                    style={[
                      styles.bar,
                      { backgroundColor: Colors.calorieRingCarbs },
                      { height: (d.carbs / maxVal) * CHART_HEIGHT },
                    ]}
                  />
                  {/* Fat Bar */}
                  <View
                    style={[
                      styles.bar,
                      { backgroundColor: Colors.calorieRingFat },
                      { height: (d.fat / maxVal) * CHART_HEIGHT },
                    ]}
                  />
                </View>
              ))}
            </View>

            {/* X-axis Labels */}
            <View style={styles.xAxis}>
              {data.map((d) => (
                <Text key={d.day} style={styles.xLabel} numberOfLines={1}>
                  {d.day.substring(0, 4)}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    width: SCREEN_WIDTH - 40,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
  },
  yAxis: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    width: 32,
    marginRight: 6,
  },
  yLabel: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  chartArea: {
    flex: 1,
    height: 160,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.border,
    borderStyle: 'dashed',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
  },
  dayGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: 28,
    justifyContent: 'center',
    gap: 2,
  },
  bar: {
    width: 8,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 8,
  },
  xLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
    width: 28,
  },
});
