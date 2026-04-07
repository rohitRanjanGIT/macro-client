import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RecipeIngredient {
  id: string;
  name: string;
  serving: string;
  qty: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface SavedRecipe {
  id: string;
  name: string;
  serving: string;       // e.g. "1 bowl (200g)"
  servings: number;      // total servings this recipe makes
  calories: number;      // per serving
  protein: number;
  carbs: number;
  fat: number;
  color: string;
  tags: string[];
  ingredients: RecipeIngredient[];
  createdAt: number;
}

interface RecipeContextType {
  recipes: SavedRecipe[];
  addRecipe: (recipe: Omit<SavedRecipe, 'id' | 'createdAt'>) => void;
  updateRecipe: (id: string, updates: Partial<Omit<SavedRecipe, 'id' | 'createdAt'>>) => void;
  deleteRecipe: (id: string) => void;
  loading: boolean;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const PALETTE = ['#E8DCC8', '#C8D8C8', '#D8D0C8', '#D0C8D8', '#C8D0E8', '#D8C8D0', '#C8E8D8'];

const SEED_RECIPES: SavedRecipe[] = [
  {
    id: 'seed-1',
    name: 'Chole (homemade)',
    serving: '1 katori (200g)',
    servings: 4,
    calories: 285,
    protein: 12,
    carbs: 34,
    fat: 10,
    color: '#E8DCC8',
    tags: ['lunch', 'dinner'],
    ingredients: [
      { id: 'i1', name: 'Chickpeas (boiled)', serving: '100g', qty: 4, calories: 164, protein: 9, carbs: 27, fat: 3 },
      { id: 'i2', name: 'Onion', serving: '1 medium (110g)', qty: 1, calories: 44, protein: 1, carbs: 10, fat: 0 },
      { id: 'i3', name: 'Tomato', serving: '1 medium (120g)', qty: 2, calories: 22, protein: 1, carbs: 5, fat: 0 },
      { id: 'i4', name: 'Oil (vegetable)', serving: '1 tbsp (14g)', qty: 2, calories: 124, protein: 0, carbs: 0, fat: 14 },
      { id: 'i5', name: 'Spices mix', serving: '1 tsp (5g)', qty: 1, calories: 15, protein: 0, carbs: 3, fat: 0 },
      { id: 'i6', name: 'Ginger garlic paste', serving: '1 tbsp (15g)', qty: 1, calories: 20, protein: 1, carbs: 4, fat: 0 },
    ],
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-2',
    name: 'Morning oats combo',
    serving: '1 bowl (300g)',
    servings: 1,
    calories: 360,
    protein: 14,
    carbs: 58,
    fat: 8,
    color: '#C8D8C8',
    tags: ['breakfast'],
    ingredients: [
      { id: 'i7', name: 'Rolled oats', serving: '50g', qty: 1, calories: 190, protein: 6, carbs: 34, fat: 3 },
      { id: 'i8', name: 'Banana', serving: '1 medium (120g)', qty: 1, calories: 107, protein: 1, carbs: 27, fat: 0 },
      { id: 'i9', name: 'Honey', serving: '1 tsp (7g)', qty: 1, calories: 21, protein: 0, carbs: 6, fat: 0 },
      { id: 'i10', name: 'Milk (full fat)', serving: '200ml', qty: 1, calories: 122, protein: 6, carbs: 10, fat: 6 },
    ],
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-3',
    name: 'Roti + dal + raita',
    serving: '2 roti + 1 katori dal + 1 sm bowl raita',
    servings: 1,
    calories: 565,
    protein: 28,
    carbs: 72,
    fat: 14,
    color: '#D0C8D8',
    tags: ['dinner', 'combo'],
    ingredients: [
      { id: 'i11', name: 'Roti (whole wheat)', serving: '1 piece (40g)', qty: 2, calories: 120, protein: 4, carbs: 20, fat: 3 },
      { id: 'i12', name: 'Moong dal (cooked)', serving: '1 katori (200g)', qty: 1, calories: 180, protein: 14, carbs: 28, fat: 2 },
      { id: 'i13', name: 'Curd (plain)', serving: '1 bowl (100g)', qty: 1, calories: 60, protein: 4, carbs: 6, fat: 2 },
    ],
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = '@macro_recipes_v1';

const RecipeContext = createContext<RecipeContextType | null>(null);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<SavedRecipe[]>(SEED_RECIPES);
  const [loading, setLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: SavedRecipe[] = JSON.parse(raw);
          // Merge: keep seed recipes that haven't been deleted, plus user recipes
          const seedIds = new Set(SEED_RECIPES.map(r => r.id));
          const userRecipes = parsed.filter(r => !seedIds.has(r.id));
          const keptSeeds = SEED_RECIPES.filter(s =>
            !parsed.some(r => r.id === s.id && (r as any).__deleted)
          );
          setRecipes([...keptSeeds, ...userRecipes]);
        }
      } catch {} finally {
        setLoading(false);
      }
    })();
  }, []);

  // Persist to storage whenever recipes change
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes)).catch(() => {});
    }
  }, [recipes, loading]);

  function addRecipe(recipe: Omit<SavedRecipe, 'id' | 'createdAt'>) {
    const newRecipe: SavedRecipe = {
      ...recipe,
      id: `user-${Date.now()}`,
      createdAt: Date.now(),
    };
    setRecipes(prev => [newRecipe, ...prev]);
  }

  function updateRecipe(id: string, updates: Partial<Omit<SavedRecipe, 'id' | 'createdAt'>>) {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }

  function deleteRecipe(id: string) {
    setRecipes(prev => prev.filter(r => r.id !== id));
  }

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, updateRecipe, deleteRecipe, loading }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error('useRecipes must be used within RecipeProvider');
  return ctx;
}

export { PALETTE };
