import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
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
  const size = 220;
  const center = size / 2;

  // Outer → inner: carbs, protein, fat
  // Each ring is thinner as it gets inward, with more breathing room between them
  const rings = [
    {
      radius: 92,
      strokeWidth: 13,
      progress: carbs / carbsGoal,
      color: Colors.calorieRingCarbs,
      trackColor: '#4ADE8018',
    },
    {
      radius: 73,
      strokeWidth: 11,
      progress: protein / proteinGoal,
      color: Colors.calorieRingProtein,
      trackColor: '#3B82F618',
    },
    {
      radius: 56,
      strokeWidth: 9,
      progress: fat / fatGoal,
      color: Colors.calorieRingFat,
      trackColor: '#F9731618',
    },
  ];

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Defs>
          {/* Subtle inner shadow overlay for the center disc */}
          <RadialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.04" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {rings.map((ring, index) => {
          const circumference = 2 * Math.PI * ring.radius;
          const progress = Math.min(ring.progress, 1);
          const strokeDashoffset = circumference * (1 - progress);

          return (
            <React.Fragment key={index}>
              {/* Track ring */}
              <Circle
                cx={center}
                cy={center}
                r={ring.radius}
                stroke={ring.trackColor}
                strokeWidth={ring.strokeWidth}
                fill="none"
                strokeLinecap="round"
              />
              {/* Progress ring */}
              <Circle
                cx={center}
                cy={center}
                r={ring.radius}
                stroke={ring.color}
                strokeWidth={ring.strokeWidth}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
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
        <View style={styles.divider} />
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
    gap: 3,
  },
  calorieCount: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1,
    lineHeight: 44,
  },
  divider: {
    width: 28,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: Colors.border,
    marginVertical: 1,
  },
  calorieLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
