export interface FoodItem {
  id: string;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags?: string[];
}

export interface SelectedItem extends FoodItem {
  servings: number;
}

export type TabKey = 'recent' | 'recipes' | 'combos';
export type FilterKey = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snack', label: 'Snack' },
];

export const TABS: { key: TabKey; label: string }[] = [
  { key: 'recent', label: 'Recents' },
  { key: 'recipes', label: 'My Recipes' },
  { key: 'combos', label: 'Combos' },
];

export const recentFoods: FoodItem[] = [
  { id: 'r1', name: 'Dal tadka (moong)', serving: '1 bowl (200g) - homemade', calories: 180, protein: 12, carbs: 22, fat: 4, tags: ['lunch', 'dinner'] },
  { id: 'r2', name: 'Jeera rice', serving: '1 katori (150g)', calories: 195, protein: 4, carbs: 38, fat: 3, tags: ['lunch', 'dinner'] },
  { id: 'r3', name: 'Paneer butter masala', serving: '1 bowl (200g) - restaurant', calories: 340, protein: 18, carbs: 12, fat: 24, tags: ['lunch', 'dinner'] },
  { id: 'r4', name: 'Roti (whole wheat)', serving: '2 pieces - homemade', calories: 240, protein: 8, carbs: 40, fat: 6, tags: ['lunch', 'dinner'] },
  { id: 'r5', name: 'Curd (plain)', serving: '1 bowl (150g)', calories: 90, protein: 7, carbs: 9, fat: 3, tags: ['breakfast', 'snack'] },
  { id: 'r6', name: 'Aloo sabzi', serving: '1 katori (120g)', calories: 150, protein: 3, carbs: 22, fat: 5, tags: ['lunch', 'dinner'] },
];
