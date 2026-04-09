import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ComboItem {
  id: string;
  name: string;
  serving: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface SavedCombo {
  id: string;
  name: string;
  color: string;
  items: ComboItem[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  createdAt: number;
}

interface ComboContextType {
  combos: SavedCombo[];
  addCombo: (combo: Omit<SavedCombo, 'id' | 'createdAt'>) => void;
  updateCombo: (id: string, updates: Partial<Omit<SavedCombo, 'id' | 'createdAt'>>) => void;
  deleteCombo: (id: string) => void;
  loading: boolean;
}

const COMBO_PALETTE = ['#F0D8C0', '#C0E0D0', '#D0D8E8', '#E8D0E0', '#D8E0C0', '#E0D0C8', '#C8D8E0'];

const SEED_COMBOS: SavedCombo[] = [
  {
    id: 'combo-seed-1',
    name: 'Dinner thali',
    color: '#D0D8E8',
    items: [
      { id: 'ci1', name: 'Roti (whole wheat)', serving: '1 piece', servings: 2, calories: 120, protein: 4, carbs: 20, fat: 3 },
      { id: 'ci2', name: 'Dal tadka (moong)', serving: '1 bowl (200g)', servings: 1, calories: 180, protein: 12, carbs: 22, fat: 4 },
      { id: 'ci3', name: 'Aloo sabzi', serving: '1 katori (120g)', servings: 1, calories: 150, protein: 3, carbs: 22, fat: 5 },
      { id: 'ci4', name: 'Curd (plain)', serving: '1 bowl (150g)', servings: 1, calories: 90, protein: 7, carbs: 9, fat: 3 },
    ],
    calories: 660,
    protein: 30,
    carbs: 93,
    fat: 18,
    tags: ['dinner', 'combo'],
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
];

const STORAGE_KEY = '@macro_combos_v1';

const ComboContext = createContext<ComboContextType | null>(null);

export function ComboProvider({ children }: { children: ReactNode }) {
  const [combos, setCombos] = useState<SavedCombo[]>(SEED_COMBOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: SavedCombo[] = JSON.parse(raw);
          const seedIds = new Set(SEED_COMBOS.map(c => c.id));
          const userCombos = parsed.filter(c => !seedIds.has(c.id));
          const keptSeeds = SEED_COMBOS.filter(s =>
            !parsed.some(c => c.id === s.id && (c as any).__deleted)
          );
          setCombos([...keptSeeds, ...userCombos]);
        }
      } catch {} finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(combos)).catch(() => {});
    }
  }, [combos, loading]);

  function addCombo(combo: Omit<SavedCombo, 'id' | 'createdAt'>) {
    const newCombo: SavedCombo = {
      ...combo,
      id: `combo-${Date.now()}`,
      createdAt: Date.now(),
    };
    setCombos(prev => [newCombo, ...prev]);
  }

  function updateCombo(id: string, updates: Partial<Omit<SavedCombo, 'id' | 'createdAt'>>) {
    setCombos(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }

  function deleteCombo(id: string) {
    setCombos(prev => prev.filter(c => c.id !== id));
  }

  return (
    <ComboContext.Provider value={{ combos, addCombo, updateCombo, deleteCombo, loading }}>
      {children}
    </ComboContext.Provider>
  );
}

export function useCombos() {
  const ctx = useContext(ComboContext);
  if (!ctx) throw new Error('useCombos must be used within ComboProvider');
  return ctx;
}

export { COMBO_PALETTE };
