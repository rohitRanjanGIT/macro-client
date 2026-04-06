import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import CalorieRing from '../components/CalorieRing';
import MacroLegend from '../components/MacroLegend';
import StatsRow from '../components/StatsRow';
import MealCard from '../components/MealCard';
import AddMealButton from '../components/AddMealButton';
import MealDetailModal, { MealMacros } from '../components/MealDetailModal';
import WaterEditModal from '../components/WaterEditModal';
import AddFoodModal from '../components/AddFoodModal';
import VoiceLogModal from '../components/VoiceLogModal';

interface MealData {
  type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  name: string;
  description: string;
  calories: number;
  macros: MealMacros;
}

const meals: MealData[] = [
  {
    type: 'breakfast',
    name: 'Breakfast',
    description: 'Oats, banana, coffee',
    calories: 420,
    macros: { calories: 420, carbs: 62, protein: 14, fat: 12, fiber: 6, sugar: 18 },
  },
  {
    type: 'lunch',
    name: 'Lunch',
    description: 'Grilled chicken salad',
    calories: 524,
    macros: { calories: 524, carbs: 34, protein: 48, fat: 18, fiber: 5, sugar: 6 },
  },
  {
    type: 'snack',
    name: 'Snack',
    description: 'Greek yogurt, almonds',
    calories: 340,
    macros: { calories: 340, carbs: 28, protein: 22, fat: 16, fiber: 3, sugar: 14 },
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [waterGlasses, setWaterGlasses] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<MealData | null>(null);
  const [waterModalVisible, setWaterModalVisible] = useState(false);
  const [addFoodVisible, setAddFoodVisible] = useState(false);
  const [voiceLogVisible, setVoiceLogVisible] = useState(false);

  // Mock data matching the design
  const data = {
    eaten: 1284,
    goal: 2100,
    carbs: 148,
    protein: 86,
    fat: 35,
    carbsGoal: 250,
    proteinGoal: 140,
    fatGoal: 70,
  };

  const remaining = data.goal - data.eaten;

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{dateString}</Text>
          <Text style={styles.greeting}>Hi there</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.avatarText}>R</Text>
        </TouchableOpacity>
      </View>

      {/* Calorie Ring */}
      <CalorieRing
        eaten={data.eaten}
        goal={data.goal}
        carbs={data.carbs}
        protein={data.protein}
        fat={data.fat}
        carbsGoal={data.carbsGoal}
        proteinGoal={data.proteinGoal}
        fatGoal={data.fatGoal}
      />

      {/* Macro Legend */}
      <MacroLegend carbs={data.carbs} protein={data.protein} fat={data.fat} />

      {/* Stats Row */}
      <StatsRow
        eaten={data.eaten}
        remaining={remaining}
        waterGlasses={waterGlasses}
        onAddWater={() => setWaterGlasses((prev) => prev + 1)}
        onLongPressWater={() => setWaterModalVisible(true)}
      />

      {/* Today's Meals */}
      <Text style={styles.sectionTitle}>Today's meals</Text>

      {meals.map((meal) => (
        <MealCard
          key={meal.type}
          type={meal.type}
          name={meal.name}
          description={meal.description}
          calories={meal.calories}
          onLongPress={() => setSelectedMeal(meal)}
        />
      ))}

      <AddMealButton
        label="Add dinner"
        onPress={() => setAddFoodVisible(true)}
        onVoicePress={() => setVoiceLogVisible(true)}
        onCameraPress={() => {}}
      />

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <MealDetailModal
          visible={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          name={selectedMeal.name}
          description={selectedMeal.description}
          macros={selectedMeal.macros}
        />
      )}

      {/* Water Edit Modal */}
      <WaterEditModal
        visible={waterModalVisible}
        onClose={() => setWaterModalVisible(false)}
        glasses={waterGlasses}
        onSetGlasses={setWaterGlasses}
      />

      {/* Add Food Modal */}
      <AddFoodModal
        visible={addFoodVisible}
        onClose={() => setAddFoodVisible(false)}
        mealType="Dinner"
        onVoicePress={() => {
          setAddFoodVisible(false);
          setVoiceLogVisible(true);
        }}
      />

      {/* Voice Log Modal */}
      <VoiceLogModal
        visible={voiceLogVisible}
        onClose={() => setVoiceLogVisible(false)}
        transcript="I had two rotis with dal makhani and a small bowl of raita for lunch"
        parsedItems={[
          { name: 'Roti (whole wheat)', serving: '2 pieces', calories: 240 },
          { name: 'Dal makhani', serving: '1 bowl (200g) - homemade', calories: 260 },
          { name: 'Raita (boondi)', serving: '1 small bowl (100g)', calories: 85 },
        ]}
        onLogMeal={() => setVoiceLogVisible(false)}
        onEditItems={() => {}}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B5998',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
});
