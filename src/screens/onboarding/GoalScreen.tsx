import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { useOnboarding, Goal } from '../../context/OnboardingContext';

const GOALS: { key: Goal; title: string; desc: string }[] = [
  { key: 'lose', title: 'Lose weight', desc: 'Calorie deficit to burn fat' },
  { key: 'gain', title: 'Gain muscle', desc: 'Calorie surplus with high protein' },
  { key: 'maintain', title: 'Maintain weight', desc: 'Stay at your current level' },
  { key: 'track', title: 'Just track', desc: 'No target, just log my food' },
];

export default function GoalScreen({ navigation }: any) {
  const { data, updateData } = useOnboarding();

  const handleSelect = (goal: Goal) => {
    updateData({ goal });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={Colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.step}>1/4</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What's your goal?</Text>
        <Text style={styles.subtitle}>This sets your daily calorie target</Text>

        <View style={styles.options}>
          {GOALS.map(g => (
            <TouchableOpacity
              key={g.key}
              style={[styles.option, data.goal === g.key && styles.optionSelected]}
              onPress={() => handleSelect(g.key)}
            >
              <Text style={[styles.optionTitle, data.goal === g.key && styles.optionTitleSelected]}>{g.title}</Text>
              <Text style={[styles.optionDesc, data.goal === g.key && styles.optionDescSelected]}>{g.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.button, !data.goal && styles.buttonDisabled]}
          onPress={() => data.goal && navigation.navigate('AboutYou')}
          disabled={!data.goal}
        >
          <Text style={[styles.buttonText, !data.goal && styles.buttonTextDisabled]}>Continue</Text>
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
  optionDescSelected: {
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
