import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { Colors } from '../constants/colors';
import { useRecipes, SavedRecipe } from '../context/RecipeContext';
import CreateRecipeModal from '../screens/PrepScreen/CreateRecipeModal';

// ─── Data types ───────────────────────────────────────────────────────────────

interface RecentFood {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AddFoodModalProps {
  visible: boolean;
  onClose: () => void;
  mealType: string;
  onVoicePress?: () => void;
  onCameraPress?: () => void;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const recentFoods: RecentFood[] = [
  { name: 'Dal tadka (moong)', serving: '1 bowl (200g) - homemade', calories: 180, protein: 12, carbs: 22, fat: 4 },
  { name: 'Jeera rice', serving: '1 katori (150g)', calories: 195, protein: 4, carbs: 38, fat: 3 },
  { name: 'Paneer butter masala', serving: '1 bowl (200g) - restaurant', calories: 340, protein: 18, carbs: 12, fat: 24 },
  { name: 'Roti (whole wheat)', serving: '2 pieces - homemade', calories: 240, protein: 8, carbs: 40, fat: 6 },
  { name: 'Curd (plain)', serving: '1 bowl (150g)', calories: 90, protein: 7, carbs: 9, fat: 3 },
  { name: 'Aloo sabzi', serving: '1 katori (120g)', calories: 150, protein: 3, carbs: 22, fat: 5 },
];


// ─── Icons ────────────────────────────────────────────────────────────────────

function CameraIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke={Colors.text}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="13" r="4" stroke={Colors.text} strokeWidth="1.8" />
    </Svg>
  );
}

function VoiceIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
        stroke={Colors.text}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 10v2a7 7 0 01-14 0v-2"
        stroke={Colors.text}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="12" y1="19" x2="12" y2="23" stroke={Colors.text} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function ManualIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        stroke={Colors.text}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={Colors.text}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlusIcon({ color = Colors.accent }: { color?: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5" stroke={Colors.text} strokeWidth="2" strokeLinecap="round" />
      <Path d="M12 19l-7-7 7-7" stroke={Colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}


// ─── Manual Entry Panel ───────────────────────────────────────────────────────

type ManualTab = 'recent' | 'recipes';

interface SelectedFood {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

function ManualPanel({
  onBack,
  onAdd,
}: {
  onBack: () => void;
  onAdd: (food: SelectedFood, servings: number) => void;
}) {
  const { recipes: contextRecipes } = useRecipes();
  const [tab, setTab] = useState<ManualTab>('recent');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SelectedFood | null>(null);
  const [servings, setServings] = useState(1);
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);

  function handleSelectFood(food: SelectedFood) {
    setSelected(food);
    setServings(1);
  }

  function handleConfirm() {
    if (selected) onAdd(selected, servings);
  }

  const filteredRecent = recentFoods.filter(
    f => f.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredRecipes = contextRecipes.filter(
    r => r.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Show CreateRecipeModal as an overlay ──
  // (rendered at end of list pane, not as a screen swap)

  // ── Detail pane ──
  if (selected) {
    const totalCal = Math.round(selected.calories * servings);
    const totalP = Math.round(selected.protein * servings);
    const totalC = Math.round(selected.carbs * servings);
    const totalF = Math.round(selected.fat * servings);

    return (
      <View style={manualStyles.root}>
        {/* Header */}
        <View style={manualStyles.header}>
          <TouchableOpacity onPress={() => setSelected(null)} hitSlop={12} style={manualStyles.backBtn}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={manualStyles.headerTitle} numberOfLines={1}>{selected.name}</Text>
        </View>

        {/* Nutrition summary */}
        <View style={manualStyles.nutritionCard}>
          <View style={manualStyles.calRow}>
            <Text style={manualStyles.calNum}>{totalCal}</Text>
            <Text style={manualStyles.calLabel}>kcal</Text>
          </View>
          <View style={manualStyles.macroRow}>
            {[
              { label: 'Protein', val: totalP, color: Colors.calorieRingProtein },
              { label: 'Carbs', val: totalC, color: Colors.calorieRingCarbs },
              { label: 'Fat', val: totalF, color: Colors.calorieRingFat },
            ].map(m => (
              <View key={m.label} style={manualStyles.macroPill}>
                <View style={[manualStyles.macroBar, { backgroundColor: m.color }]} />
                <Text style={manualStyles.macroVal}>{m.val}g</Text>
                <Text style={manualStyles.macroLbl}>{m.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Serving info */}
        <Text style={manualStyles.servingHint}>{selected.serving}</Text>

        {/* Servings stepper */}
        <View style={manualStyles.stepperRow}>
          <Text style={manualStyles.stepperLabel}>Servings</Text>
          <View style={manualStyles.stepper}>
            <TouchableOpacity
              style={manualStyles.stepBtn}
              onPress={() => setServings(s => Math.max(0.5, parseFloat((s - 0.5).toFixed(1))))}
            >
              <Text style={manualStyles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={manualStyles.stepCount}>{servings}</Text>
            <TouchableOpacity
              style={manualStyles.stepBtn}
              onPress={() => setServings(s => parseFloat((s + 0.5).toFixed(1)))}
            >
              <Text style={manualStyles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add button */}
        <TouchableOpacity style={manualStyles.addBtn} onPress={handleConfirm} activeOpacity={0.85}>
          <Text style={manualStyles.addBtnText}>Add to meal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── List pane ──
  return (
    <View style={manualStyles.root}>
      {/* Header */}
      <View style={manualStyles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12} style={manualStyles.backBtn}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={manualStyles.headerTitle}>Add manually</Text>
      </View>

      {/* Search */}
      <View style={manualStyles.searchBar}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Circle cx="11" cy="11" r="7" stroke={Colors.textMuted} strokeWidth="2" />
          <Line x1="16.5" y1="16.5" x2="21" y2="21" stroke={Colors.textMuted} strokeWidth="2" strokeLinecap="round" />
        </Svg>
        <TextInput
          style={manualStyles.searchInput}
          placeholder="Search food or recipe..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoFocus
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
            <Text style={{ color: Colors.textMuted, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={manualStyles.tabRow}>
        {([
          { key: 'recent', label: 'Previous Meals' },
          { key: 'recipes', label: 'My Recipes' },
        ] as { key: ManualTab; label: string }[]).map(t => (
          <TouchableOpacity
            key={t.key}
            style={[manualStyles.tab, tab === t.key && manualStyles.tabActive]}
            onPress={() => setTab(t.key)}
            activeOpacity={0.75}
          >
            <Text style={[manualStyles.tabText, tab === t.key && manualStyles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {tab === 'recent' && (
          <>
            {filteredRecent.length === 0 ? (
              <Text style={manualStyles.emptyText}>No results for "{search}"</Text>
            ) : (
              filteredRecent.map((food, i) => (
                <TouchableOpacity
                  key={i}
                  style={manualStyles.foodRow}
                  onPress={() => handleSelectFood({
                    name: food.name,
                    serving: food.serving,
                    calories: food.calories,
                    protein: food.protein,
                    carbs: food.carbs,
                    fat: food.fat,
                  })}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={manualStyles.foodName}>{food.name}</Text>
                    <Text style={manualStyles.foodServing}>{food.serving}</Text>
                    <Text style={manualStyles.foodMacros}>
                      P {food.protein}g · C {food.carbs}g · F {food.fat}g
                    </Text>
                  </View>
                  <View style={manualStyles.foodRight}>
                    <Text style={manualStyles.foodCal}>{food.calories}</Text>
                    <Text style={manualStyles.foodCalLabel}>kcal</Text>
                    <View style={manualStyles.addCircle}>
                      <PlusIcon />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {tab === 'recipes' && (
          <>
            {filteredRecipes.length === 0 ? (
              <Text style={manualStyles.emptyText}>No results for "{search}"</Text>
            ) : (
              filteredRecipes.map((recipe, i) => (
                <TouchableOpacity
                  key={i}
                  style={manualStyles.foodRow}
                  onPress={() => handleSelectFood({
                    name: recipe.name,
                    serving: recipe.serving,
                    calories: recipe.calories,
                    protein: recipe.protein,
                    carbs: recipe.carbs,
                    fat: recipe.fat,
                  })}
                  activeOpacity={0.7}
                >
                  {/* Color dot */}
                  <View style={[manualStyles.recipeColorDot, { backgroundColor: recipe.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={manualStyles.foodName}>{recipe.name}</Text>
                    <Text style={manualStyles.foodServing}>{recipe.serving}</Text>
                    <Text style={manualStyles.foodMacros}>
                      P {recipe.protein}g · C {recipe.carbs}g · F {recipe.fat}g
                    </Text>
                  </View>
                  <View style={manualStyles.foodRight}>
                    <Text style={manualStyles.foodCal}>{recipe.calories}</Text>
                    <Text style={manualStyles.foodCalLabel}>kcal</Text>
                    <View style={manualStyles.addCircle}>
                      <PlusIcon />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}

            {/* Create new recipe — reuses CreateRecipeModal from PrepScreen */}
            <TouchableOpacity style={manualStyles.newRecipeRow} onPress={() => setShowCreateRecipe(true)} activeOpacity={0.7}>
              <View style={manualStyles.newRecipeIcon}>
                <PlusIcon color={Colors.accent} />
              </View>
              <Text style={[manualStyles.newRecipeText, { color: Colors.text }]}>Create new recipe</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Reuse shared CreateRecipeModal — writes directly to RecipeContext */}
      <CreateRecipeModal
        visible={showCreateRecipe}
        onClose={() => { setShowCreateRecipe(false); setTab('recipes'); }}
      />
    </View>
  );
}

// ─── Recipe card (horizontal strip — main modal) ──────────────────────────────

function RecipeCard({ recipe }: { recipe: SavedRecipe }) {
  return (
    <View style={styles.recipeCard}>
      <View style={[styles.recipeIcon, { backgroundColor: recipe.color }]}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 6c0-1.7-1.3-3-3-3S6 4.3 6 6c0 1.3.8 2.4 2 2.8V20h2V8.8c1.2-.4 2-1.5 2-2.8z"
            stroke="#666"
            strokeWidth="1.5"
            fill="none"
          />
        </Svg>
      </View>
      <Text style={styles.recipeName}>{recipe.name}</Text>
      <Text style={styles.recipeCal}>{recipe.calories} kcal</Text>
    </View>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function AddFoodModal({ visible, onClose, mealType, onVoicePress, onCameraPress }: AddFoodModalProps) {
  const { recipes } = useRecipes();
  const [showManual, setShowManual] = useState(false);

  function handleClose() {
    setShowManual(false);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.container}>
        {showManual ? (
          /* ── Manual panel fills the modal ── */
          <ManualPanel
            onBack={() => setShowManual(false)}
            onAdd={(food, servings) => {
              // TODO: persist to meal state
              handleClose();
            }}
          />
        ) : (
          /* ── Default browse view ── */
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Add to {mealType.toLowerCase()}</Text>
              <TouchableOpacity onPress={handleClose} hitSlop={12}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search bar */}
            <View style={styles.searchBar}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="11" cy="11" r="7" stroke={Colors.textMuted} strokeWidth="2" />
                <Line x1="16.5" y1="16.5" x2="21" y2="21" stroke={Colors.textMuted} strokeWidth="2" strokeLinecap="round" />
              </Svg>
              <TextInput
                style={styles.searchInput}
                placeholder="Search food or brand..."
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            {/* Input method cards */}
            <View style={styles.inputMethods}>
              <TouchableOpacity
                style={[styles.methodCard, { backgroundColor: '#4ADE8015', borderColor: '#4ADE8040' }]}
                activeOpacity={0.7}
                onPress={onCameraPress}
              >
                <CameraIcon />
                <Text style={styles.methodTitle}>Camera</Text>
                <Text style={styles.methodSub}>Snap or scan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.methodCard, { backgroundColor: '#F5F0E115', borderColor: '#F5F0E140' }]}
                activeOpacity={0.7}
                onPress={onVoicePress}
              >
                <VoiceIcon />
                <Text style={styles.methodTitle}>Voice</Text>
                <Text style={styles.methodSub}>Say what you{'\n'}ate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.methodCard, { backgroundColor: '#A78BFA15', borderColor: '#A78BFA40' }]}
                activeOpacity={0.7}
                onPress={() => setShowManual(true)}
              >
                <ManualIcon />
                <Text style={styles.methodTitle}>Manual</Text>
                <Text style={styles.methodSub}>Pick or{'\n'}search</Text>
              </TouchableOpacity>
            </View>

            {/* Recent */}
            <Text style={styles.sectionLabel}>RECENT</Text>
            {recentFoods.map((food, index) => (
              <TouchableOpacity key={index} style={styles.foodRow} activeOpacity={0.7}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodServing}>{food.serving}</Text>
                </View>
                <View style={styles.foodNutrition}>
                  <Text style={styles.foodCal}>{food.calories} kcal</Text>
                  <Text style={styles.foodMacros}>
                    P {food.protein}g  C {food.carbs}g  F{'\n'}{food.fat}g
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* My Recipes */}
            <Text style={[styles.sectionLabel, { marginTop: 24 }]}>MY RECIPES</Text>
            <FlatList
              horizontal
              data={recipes}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipesRow}
              scrollEnabled
            />
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  closeBtn: {
    fontSize: 20,
    color: Colors.textMuted,
    padding: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    padding: 0,
  },
  inputMethods: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  methodCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  methodSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 14,
  },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '40',
  },
  foodInfo: {
    flex: 1,
    marginRight: 12,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },
  foodServing: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  foodNutrition: {
    alignItems: 'flex-end',
  },
  foodCal: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },
  foodMacros: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
    lineHeight: 15,
  },
  recipesRow: {
    gap: 12,
    paddingBottom: 8,
  },
  recipeCard: {
    width: 120,
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  recipeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  recipeCal: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

const manualStyles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
    marginTop: 8,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    padding: 0,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: 3,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '40',
    gap: 10,
  },
  recipeColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  foodServing: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  foodMacros: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  foodRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  foodCal: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  foodCalLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  addCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.accent + '50',
    marginTop: 2,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
  newRecipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
    marginTop: 4,
  },
  newRecipeIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  newRecipeText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },

  // Detail pane
  nutritionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    gap: 14,
  },
  calRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  calNum: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 48,
  },
  calLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  macroRow: {
    flexDirection: 'row',
    gap: 10,
  },
  macroPill: {
    flex: 1,
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  macroBar: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginBottom: 2,
  },
  macroVal: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  macroLbl: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  servingHint: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 18,
    marginLeft: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  stepperLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 10,
    overflow: 'hidden',
  },
  stepBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stepBtnText: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: '600',
  },
  stepCount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 28,
    textAlign: 'center',
  },
  addBtn: {
    backgroundColor: Colors.text,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
});


