import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { useOnboarding, Sex } from '../../context/OnboardingContext';

const SEX_OPTIONS: { key: Sex; label: string }[] = [
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' },
  { key: 'other', label: 'Other' },
];

export default function AboutYouScreen({ navigation }: any) {
  const { data, updateData } = useOnboarding();

  const isValid = data.sex && data.age && data.height && data.weight;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={Colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.step}>2/4</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>About you</Text>

        {/* Sex */}
        <Text style={styles.label}>Sex</Text>
        <View style={styles.sexRow}>
          {SEX_OPTIONS.map(s => (
            <TouchableOpacity
              key={s.key}
              style={[styles.sexPill, data.sex === s.key && styles.sexPillSelected]}
              onPress={() => updateData({ sex: s.key })}
            >
              <Text style={[styles.sexPillText, data.sex === s.key && styles.sexPillTextSelected]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={data.age}
          onChangeText={v => updateData({ age: v.replace(/[^0-9]/g, '') })}
          placeholder="25"
          placeholderTextColor={Colors.textMuted}
          keyboardType="numeric"
          maxLength={3}
        />

        {/* Height */}
        <Text style={styles.label}>Height</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            value={data.height}
            onChangeText={v => updateData({ height: v.replace(/[^0-9.]/g, '') })}
            placeholder="175"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            maxLength={6}
          />
          <View style={styles.unitToggle}>
            <TouchableOpacity
              style={[styles.unitButton, data.heightUnit === 'cm' && styles.unitButtonActive]}
              onPress={() => updateData({ heightUnit: 'cm' })}
            >
              <Text style={[styles.unitText, data.heightUnit === 'cm' && styles.unitTextActive]}>cm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, data.heightUnit === 'ft' && styles.unitButtonActive]}
              onPress={() => updateData({ heightUnit: 'ft' })}
            >
              <Text style={[styles.unitText, data.heightUnit === 'ft' && styles.unitTextActive]}>ft</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weight */}
        <Text style={styles.label}>Weight</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            value={data.weight}
            onChangeText={v => updateData({ weight: v.replace(/[^0-9.]/g, '') })}
            placeholder="78"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            maxLength={6}
          />
          <View style={styles.unitToggle}>
            <TouchableOpacity
              style={[styles.unitButton, data.weightUnit === 'kg' && styles.unitButtonActive]}
              onPress={() => updateData({ weightUnit: 'kg' })}
            >
              <Text style={[styles.unitText, data.weightUnit === 'kg' && styles.unitTextActive]}>kg</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, data.weightUnit === 'lb' && styles.unitButtonActive]}
              onPress={() => updateData({ weightUnit: 'lb' })}
            >
              <Text style={[styles.unitText, data.weightUnit === 'lb' && styles.unitTextActive]}>lb</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={() => isValid && navigation.navigate('ActivityLevel')}
          disabled={!isValid}
        >
          <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>Continue</Text>
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
  },
  contentInner: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 10,
    fontWeight: '500',
  },
  sexRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  sexPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sexPillSelected: {
    backgroundColor: Colors.cardBackgroundLight,
    borderColor: Colors.text,
  },
  sexPillText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  sexPillTextSelected: {
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: Colors.text,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 0,
  },
  inputFlex: {
    flex: 1,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginTop: 0,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  unitButtonActive: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  unitText: {
    fontSize: 15,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  unitTextActive: {
    color: Colors.text,
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
