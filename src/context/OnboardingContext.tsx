import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Goal = 'lose' | 'gain' | 'maintain' | 'track';
export type Sex = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very';

export interface OnboardingData {
  goal: Goal | null;
  sex: Sex | null;
  age: string;
  height: string;
  weight: string;
  heightUnit: 'cm' | 'ft';
  weightUnit: 'kg' | 'lb';
  activityLevel: ActivityLevel | null;
  targetWeight: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  isOnboarded: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  loading: boolean;
}

const defaultData: OnboardingData = {
  goal: null,
  sex: null,
  age: '',
  height: '',
  weight: '',
  heightUnit: 'cm',
  weightUnit: 'kg',
  activityLevel: null,
  targetWeight: '',
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

const STORAGE_KEY_ONBOARDED = '@macro_onboarded';
const STORAGE_KEY_DATA = '@macro_onboarding_data';

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [onboarded, savedData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_ONBOARDED),
          AsyncStorage.getItem(STORAGE_KEY_DATA),
        ]);
        if (onboarded === 'true') setIsOnboarded(true);
        if (savedData) setData(JSON.parse(savedData));
      } catch {} finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateData = (partial: Partial<OnboardingData>) => {
    setData(prev => {
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(next));
      return next;
    });
  };

  const completeOnboarding = () => {
    setIsOnboarded(true);
    AsyncStorage.setItem(STORAGE_KEY_ONBOARDED, 'true');
  };

  const resetOnboarding = () => {
    setIsOnboarded(false);
    AsyncStorage.multiRemove([STORAGE_KEY_ONBOARDED, STORAGE_KEY_DATA]);
    setData(defaultData);
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, isOnboarded, completeOnboarding, resetOnboarding, loading }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}

// --- Calculation helpers ---

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
};

const GOAL_OFFSETS: Record<Goal, number> = {
  lose: -300,
  gain: 300,
  maintain: 0,
  track: 0,
};

const GOAL_MACROS: Record<Goal, { carbs: number; protein: number; fat: number }> = {
  lose: { carbs: 40, protein: 30, fat: 30 },
  gain: { carbs: 40, protein: 35, fat: 25 },
  maintain: { carbs: 50, protein: 25, fat: 25 },
  track: { carbs: 50, protein: 25, fat: 25 },
};

export function calculateBMR(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  // Mifflin-St Jeor
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'female' ? base - 161 : base + 5;
}

export function calculateTDEE(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activity]);
}

export function calculateCalories(tdee: number, goal: Goal): number {
  return Math.round(tdee + GOAL_OFFSETS[goal]);
}

export function getMacros(goal: Goal) {
  return GOAL_MACROS[goal];
}

export function getActivityMultiplier(activity: ActivityLevel): number {
  return ACTIVITY_MULTIPLIERS[activity];
}

export function getGoalOffset(goal: Goal): number {
  return GOAL_OFFSETS[goal];
}

export function macroGrams(calories: number, pct: number, calPerGram: number): number {
  return Math.round((calories * pct / 100) / calPerGram);
}
