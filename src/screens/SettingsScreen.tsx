import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Colors } from '../constants/colors';
import { useApi } from '../lib/useApi';
import {
  useOnboarding,
  calculateBMR,
  calculateTDEE,
  calculateCalories,
  getMacros,
} from '../context/OnboardingContext';

const GOAL_LABELS: Record<string, string> = {
  lose: 'Lose weight',
  gain: 'Gain muscle',
  maintain: 'Maintain weight',
  track: 'Just track',
};

export default function SettingsScreen({ navigation }: any) {
  const { data, resetOnboarding } = useOnboarding();
  const { signOut } = useAuth();
  const { user } = useUser();
  const api = useApi();
  const [mealReminders, setMealReminders] = React.useState(true);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api('/auth/account/delete/', { method: 'DELETE' });
            } catch {}
            resetOnboarding();
            await signOut();
          },
        },
      ],
    );
  };

  // Calculate display values
  const weightKg = data.weightUnit === 'lb' ? parseFloat(data.weight) * 0.453592 : parseFloat(data.weight);
  const heightCm = data.heightUnit === 'ft' ? parseFloat(data.height) * 30.48 : parseFloat(data.height);
  const age = parseInt(data.age, 10);

  let calories = 0;
  let macros = { carbs: 50, protein: 25, fat: 25 };
  if (data.sex && data.goal && data.activityLevel && !isNaN(weightKg) && !isNaN(heightCm) && !isNaN(age)) {
    const bmr = calculateBMR(data.sex, weightKg, heightCm, age);
    const tdee = calculateTDEE(bmr, data.activityLevel);
    calories = calculateCalories(tdee, data.goal);
    macros = getMacros(data.goal);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={Colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Profile */}
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || '?').toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.profileName}>{user?.fullName || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.emailAddresses?.[0]?.emailAddress || ''}</Text>
          </View>
        </View>

        {/* Goals */}
        <Text style={styles.sectionLabel}>Goals</Text>
        <View style={styles.section}>
          <SettingsRow label="Calorie target" value={`${calories.toLocaleString()} kcal`} />
          <Divider />
          <SettingsRow label="Macro split" value={`${macros.carbs} / ${macros.protein} / ${macros.fat}`} />
          <Divider />
          <SettingsRow label="Goal" value={data.goal ? GOAL_LABELS[data.goal] : '—'} />
        </View>

        {/* Body */}
        <Text style={styles.sectionLabel}>Body</Text>
        <View style={styles.section}>
          <SettingsRow label="Height" value={data.height ? `${data.height} ${data.heightUnit}` : '—'} />
          <Divider />
          <SettingsRow label="Weight" value={data.weight ? `${data.weight} ${data.weightUnit}` : '—'} />
          <Divider />
          <SettingsRow label="Target weight" value={data.targetWeight ? `${data.targetWeight} ${data.weightUnit}` : '—'} />
        </View>

        {/* Preferences */}
        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.section}>
          <SettingsRow label="Voice language" value="Hinglish" />
          <Divider />
          <SettingsRow label="Units" value={data.weightUnit === 'kg' ? 'Metric (kg, cm)' : 'Imperial (lb, ft)'} />
          <Divider />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Meal reminders</Text>
            <Switch
              value={mealReminders}
              onValueChange={setMealReminders}
              trackColor={{ false: Colors.cardBackground, true: Colors.accent }}
              thumbColor={Colors.text}
            />
          </View>
          <Divider />
          <SettingsRow label="Notifications" value="On" />
        </View>

        {/* Account */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Export my data</Text>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Privacy policy</Text>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity style={styles.row} onPress={handleSignOut}>
            <Text style={styles.rowLabel}>Log out</Text>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity style={styles.row} onPress={handleDeleteAccount}>
            <Text style={[styles.rowLabel, { color: Colors.danger }]}>Delete account</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sectionLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 8,
  },
  section: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 15,
    color: Colors.text,
  },
  rowValue: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 16,
  },
});
