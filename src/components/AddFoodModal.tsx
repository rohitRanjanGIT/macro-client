import React from 'react';
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
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface RecentFood {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Recipe {
  name: string;
  calories: number;
  color: string;
}

interface AddFoodModalProps {
  visible: boolean;
  onClose: () => void;
  mealType: string;
  onVoicePress?: () => void;
  onCameraPress?: () => void;
}

const recentFoods: RecentFood[] = [
  { name: 'Dal tadka (moong)', serving: '1 bowl (200g) - homemade', calories: 180, protein: 12, carbs: 22, fat: 4 },
  { name: 'Jeera rice', serving: '1 katori (150g)', calories: 195, protein: 4, carbs: 38, fat: 3 },
  { name: 'Paneer butter masala', serving: '1 bowl (200g) - restaurant', calories: 340, protein: 18, carbs: 12, fat: 24 },
  { name: 'Roti (whole wheat)', serving: '2 pieces - homemade', calories: 240, protein: 8, carbs: 40, fat: 6 },
];

const recipes: Recipe[] = [
  { name: 'Chole', calories: 285, color: '#E8DCC8' },
  { name: 'Poha', calories: 250, color: '#C8D8C8' },
  { name: 'Idli', calories: 150, color: '#D8D0C8' },
  { name: 'Dosa', calories: 200, color: '#D0C8D8' },
];

function CameraIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
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
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
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

function BarcodeIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Line x1="4" y1="4" x2="4" y2="20" stroke={Colors.text} strokeWidth="2" strokeLinecap="round" />
      <Line x1="8" y1="4" x2="8" y2="20" stroke={Colors.text} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="11" y1="4" x2="11" y2="20" stroke={Colors.text} strokeWidth="1" strokeLinecap="round" />
      <Line x1="14" y1="4" x2="14" y2="20" stroke={Colors.text} strokeWidth="2" strokeLinecap="round" />
      <Line x1="17" y1="4" x2="17" y2="20" stroke={Colors.text} strokeWidth="1" strokeLinecap="round" />
      <Line x1="20" y1="4" x2="20" y2="20" stroke={Colors.text} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
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

export default function AddFoodModal({ visible, onClose, mealType, onVoicePress, onCameraPress }: AddFoodModalProps) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add to {mealType.toLowerCase()}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
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
              style={[styles.methodCard, { backgroundColor: '#E8E4F015', borderColor: '#E8E4F040' }]}
              activeOpacity={0.7}
            >
              <BarcodeIcon />
              <Text style={styles.methodTitle}>Barcode</Text>
              <Text style={styles.methodSub}>Packaged{'\n'}food</Text>
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
            showsHorizontalScrollIndicator
            contentContainerStyle={styles.recipesRow}
            scrollEnabled
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

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
