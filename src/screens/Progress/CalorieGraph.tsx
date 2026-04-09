import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Colors } from '../../constants/colors';



interface CalorieGraphProps {
  data: { day: string; calories: number }[];
  goal: number;
}

export default function CalorieGraph({ data, goal }: CalorieGraphProps) {
  // Add some padding to max value so bars don't touch the very top
  const maxVal = Math.max(...data.map((d) => d.calories), goal * 1.2, 100);
  const CHART_HEIGHT = 160;

  return (
    <Card style={styles.card} mode="contained">
      <Card.Content style={styles.content}>
        <Text style={styles.title}>Daily Calorie Intake</Text>
        
        <View style={styles.chartContainer}>
          {/* Y-axis Labels */}
          <View style={styles.yAxis}>
            <Text style={styles.yLabel}>{Math.round(maxVal)}</Text>
            <Text style={styles.yLabel}>{Math.round(maxVal / 2)}</Text>
            <Text style={styles.yLabel}>0</Text>
          </View>

          <View style={{ flex: 1 }}>
            {/* Chart Area */}
            <View style={styles.chartArea}>
              {/* Background grid lines */}
              <View style={[styles.gridLine, { bottom: 160 }]} />
              <View style={[styles.gridLine, { bottom: 80 }]} />
              <View style={[styles.gridLine, { bottom: 0 }]} />

              {/* Goal Line */}
              <View style={[styles.goalLine, { bottom: (goal / maxVal) * CHART_HEIGHT }]} />

              {/* Bars */}
              <View style={styles.barsContainer}>
                {data.map((d, i) => {
                  const isOver = d.calories > goal;
                  const baseHeight = (Math.min(d.calories, goal) / maxVal) * CHART_HEIGHT;
                  const overflowHeight = isOver ? ((d.calories - goal) / maxVal) * CHART_HEIGHT : 0;
                  
                  return (
                    <View key={i} style={styles.dayGroup}>
                      {/* Excess Bar */}
                      {isOver && (
                        <View
                          style={[
                            styles.bar,
                            styles.barTop,
                            { backgroundColor: Colors.danger + 'CC', height: overflowHeight }
                          ]}
                        />
                      )}
                      {/* Base Bar */}
                      <View
                        style={[
                          styles.bar,
                          !isOver && styles.barTop,
                          { backgroundColor: Colors.accent + '99', height: baseHeight }
                        ]}
                      />
                    </View>
                  );
                })}
              </View>
            </View>

            {/* X-axis Labels */}
            <View style={styles.xAxis}>
              {data.map((d, i) => (
                <Text key={i} style={styles.xLabel} numberOfLines={1}>
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
    width: '100%',
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
    zIndex: -1,
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F97316AA',
    borderStyle: 'dotted',
    zIndex: -1,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
  },
  dayGroup: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 24,
  },
  barTop: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
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
