import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { useOnboarding, ActivityLevel } from '../../context/OnboardingContext';

const LEVELS: { key: ActivityLevel; title: string; desc: string }[] = [
  { key: 'sedentary', title: 'Sedentary', desc: 'Desk job, little or no exercise' },
  { key: 'light', title: 'Lightly active', desc: 'Light exercise 1-3 days/week' },
  { key: 'moderate', title: 'Moderately active', desc: 'Moderate exercise 3-5 days/week' },
  { key: 'very', title: 'Very active', desc: 'Hard exercise 6-7 days/week' },
];

export default function ActivityLevelScreen({ navigation }: any) {
  const { data, updateData } = useOnboarding();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={Colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.step}>3/4</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How active are you?</Text>
        <Text style={styles.subtitle}>This affects your daily calorie target</Text>

        <View style={styles.options}>
          {LEVELS.map(l => (
            <TouchableOpacity
              key={l.key}
              style={[styles.option, data.activityLevel === l.key && styles.optionSelected]}
              onPress={() => updateData({ activityLevel: l.key })}
            >
              <Text style={[styles.optionTitle, data.activityLevel === l.key && styles.optionTitleSelected]}>{l.title}</Text>
              <Text style={styles.optionDesc}>{l.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.button, !data.activityLevel && styles.buttonDisabled]}
          onPress={() => data.activityLevel && navigation.navigate('PlanResult')}
          disabled={!data.activityLevel}
        >
          <Text style={[styles.buttonText, !data.activityLevel && styles.buttonTextDisabled]}>Continue</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  options: {
    gap: 12,
  },
  option: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: Colors.text,
    backgroundColor: Colors.cardBackgroundLight,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: Colors.text,
  },
  optionDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
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
  buttonDisabled: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.background,
  },
  buttonTextDisabled: {
    color: Colors.textMuted,
  },
});
