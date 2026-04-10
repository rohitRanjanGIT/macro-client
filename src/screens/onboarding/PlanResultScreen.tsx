import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { useApi } from '../../lib/useApi';
import {
  useOnboarding,
  calculateBMR,
  calculateTDEE,
  calculateCalories,
  getMacros,
  getActivityMultiplier,
  getGoalOffset,
  macroGrams,
} from '../../context/OnboardingContext';

const GOAL_LABELS: Record<string, string> = {
  lose: 'Lose weight',
  gain: 'Gain muscle',
  maintain: 'Maintain weight',
  track: 'Just track',
};

export default function PlanResultScreen({ navigation }: any) {
  const { data, completeOnboarding } = useOnboarding();
  const api = useApi();
  const [syncing, setSyncing] = useState(false);

  const plan = useMemo(() => {
    if (!data.sex || !data.goal || !data.activityLevel) return null;

    const weightKg = data.weightUnit === 'lb' ? parseFloat(data.weight) * 0.453592 : parseFloat(data.weight);
    const heightCm = data.heightUnit === 'ft' ? parseFloat(data.height) * 30.48 : parseFloat(data.height);
    const age = parseInt(data.age, 10);

    if (isNaN(weightKg) || isNaN(heightCm) || isNaN(age)) return null;

    const bmr = calculateBMR(data.sex, weightKg, heightCm, age);
    const multiplier = getActivityMultiplier(data.activityLevel);
    const tdee = calculateTDEE(bmr, data.activityLevel);
    const offset = getGoalOffset(data.goal);
    const calories = calculateCalories(tdee, data.goal);
    const macros = getMacros(data.goal);

    return {
      bmr: Math.round(bmr),
      multiplier,
      tdee,
      offset,
      calories,
      macros,
      carbsG: macroGrams(calories, macros.carbs, 4),
      proteinG: macroGrams(calories, macros.protein, 4),
      fatG: macroGrams(calories, macros.fat, 9),
    };
  }, [data]);

  const handleStart = async () => {
    if (!data.sex || !data.goal || !data.activityLevel) return;
    setSyncing(true);
    try {
      const weightKg = data.weightUnit === 'lb' ? parseFloat(data.weight) * 0.453592 : parseFloat(data.weight);
      const heightCm = data.heightUnit === 'ft' ? parseFloat(data.height) * 30.48 : parseFloat(data.height);
      const age = parseInt(data.age, 10);

      // Sync profile to backend
      await api('/users/me/profile/', {
        method: 'PUT',
        body: {
          goal: data.goal,
          sex: data.sex,
          age,
          height_cm: Math.round(heightCm * 10) / 10,
          weight_kg: Math.round(weightKg * 10) / 10,
          activity_level: data.activityLevel,
        },
      });

      // Mark onboarding complete on backend
      await api('/users/me/onboarding/complete/', { method: 'POST' });

      completeOnboarding();
    } catch (err: any) {
      // Still complete locally even if backend sync fails — profile can be re-synced later
      console.warn('Backend sync failed during onboarding:', err?.message);
      completeOnboarding();
    } finally {
      setSyncing(false);
    }
  };

  if (!plan) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={Colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.step}>4/4</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Your daily plan</Text>
        <Text style={styles.subtitle}>Based on your info</Text>

        <Text style={styles.caloriesNumber}>{plan.calories.toLocaleString()}</Text>
        <Text style={styles.caloriesLabel}>calories per day</Text>

        {/* Macro split */}
        <Text style={styles.macroTitle}>Macro split</Text>
        <View style={styles.macroRow}>
          <View style={[styles.macroCard, { borderTopColor: Colors.calorieRingCarbs }]}>
            <Text style={styles.macroPct}>{plan.macros.carbs}%</Text>
            <Text style={styles.macroName}>Carbs</Text>
            <Text style={styles.macroGrams}>{plan.carbsG}g</Text>
          </View>
          <View style={[styles.macroCard, { borderTopColor: Colors.calorieRingProtein }]}>
            <Text style={styles.macroPct}>{plan.macros.protein}%</Text>
            <Text style={styles.macroName}>Protein</Text>
            <Text style={styles.macroGrams}>{plan.proteinG}g</Text>
          </View>
          <View style={[styles.macroCard, { borderTopColor: Colors.calorieRingFat }]}>
            <Text style={styles.macroPct}>{plan.macros.fat}%</Text>
            <Text style={styles.macroName}>Fat</Text>
            <Text style={styles.macroGrams}>{plan.fatG}g</Text>
          </View>
        </View>

        {/* Formula box */}
        <View style={styles.formulaBox}>
          <Text style={styles.formulaText}>
            BMR {plan.bmr.toLocaleString()} × {plan.multiplier} = {plan.tdee.toLocaleString()} TDEE
          </Text>
          {plan.offset !== 0 && (
            <Text style={styles.formulaText}>
              {GOAL_LABELS[data.goal!]}: {plan.tdee.toLocaleString()} {plan.offset > 0 ? '+' : '−'} {Math.abs(plan.offset)} = {plan.calories.toLocaleString()}
            </Text>
          )}
        </View>

        <Text style={styles.adjustNote}>Adjust anytime in settings</Text>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.button} onPress={handleStart} disabled={syncing}>
          {syncing ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.buttonText}>Start tracking</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  step: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  caloriesNumber: {
    fontSize: 56,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -1,
  },
  caloriesLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  macroTitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 12,
    fontWeight: '500',
  },
  macroRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 24,
  },
  macroCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 3,
  },
  macroPct: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  macroName: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  macroGrams: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  formulaBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    gap: 4,
    marginBottom: 16,
  },
  formulaText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  adjustNote: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  button: {
    backgroundColor: Colors.text,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.background,
  },
});
