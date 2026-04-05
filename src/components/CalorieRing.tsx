import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface CalorieRingProps {
  eaten: number;
  goal: number;
  carbs: number;
  protein: number;
  fat: number;
  carbsGoal: number;
  proteinGoal: number;
  fatGoal: number;
}

export default function CalorieRing({
  eaten,
  goal,
  carbs,
  protein,
  fat,
  carbsGoal,
  proteinGoal,
  fatGoal,
}: CalorieRingProps) {
  const size = 200;
  const strokeWidth = 14;
  const center = size / 2;

  // Three rings: outer = carbs, middle = protein, inner = fat
  const rings = [
    { radius: 85, progress: carbs / carbsGoal, color: Colors.calorieRingCarbs },
    { radius: 68, progress: protein / proteinGoal, color: Colors.calorieRingProtein },
    { radius: 51, progress: fat / fatGoal, color: Colors.calorieRingFat },
  ];

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {rings.map((ring, index) => {
          const circumference = 2 * Math.PI * ring.radius;
          const strokeDashoffset = circumference * (1 - Math.min(ring.progress, 1));
          return (
            <React.Fragment key={index}>
              {/* Background ring */}
              <Circle
                cx={center}
                cy={center}
                r={ring.radius}
                stroke={Colors.cardBackgroundLight}
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress ring */}
              <Circle
                cx={center}
                cy={center}
                r={ring.radius}
                stroke={ring.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${center}, ${center}`}
              />
            </React.Fragment>
          );
        })}
      </Svg>
      {/* Center text */}
      <View style={styles.centerText}>
        <Text style={styles.calorieCount}>{eaten.toLocaleString()}</Text>
        <Text style={styles.calorieLabel}>of {goal.toLocaleString()} kcal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  calorieCount: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.text,
  },
  calorieLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
