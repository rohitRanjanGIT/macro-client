import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface MacroData {
  protein: number;
  carbs: number;
  fat: number;
}

interface LogMealRowProps {
  mealType: string;
  foodName?: string;
  calories: number;
  macros?: MacroData;
  isLast?: boolean;
  logged?: boolean;
  onAddPress?: () => void;
  onEditPress?: () => void;
  onLongPress?: () => void;
}

function PlusIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={Colors.textMuted} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function EditIcon() {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
      <Path d="M16.474 5.408l2.118 2.118m-.756-3.982L12.109 9.27a2.118 2.118 0 00-.58 1.082L11 13l2.648-.53a2.118 2.118 0 001.082-.58l5.727-5.727a1.853 1.853 0 00-2.621-2.621z" stroke={Colors.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M19 15v3a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h3" stroke={Colors.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MacroLine({ macros }: { macros: MacroData }) {
  return (
    <View style={styles.macroLine}>
      <Text style={[styles.macroLabel, { color: Colors.calorieRingProtein }]}>P</Text>
      <Text style={styles.macroValue}>{macros.protein}g</Text>
      <Text style={styles.macroDot}>·</Text>
      <Text style={[styles.macroLabel, { color: Colors.calorieRingCarbs }]}>C</Text>
      <Text style={styles.macroValue}>{macros.carbs}g</Text>
      <Text style={styles.macroDot}>·</Text>
      <Text style={[styles.macroLabel, { color: Colors.calorieRingFat }]}>F</Text>
      <Text style={styles.macroValue}>{macros.fat}g</Text>
    </View>
  );
}

function LogMealRow({
  mealType,
  foodName,
  calories,
  macros,
  isLast,
  logged,
  onAddPress,
  onEditPress,
  onLongPress,
}: LogMealRowProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handleLongPress = useCallback(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 0 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 10 }),
    ]).start(() => onLongPress?.());
  }, [onLongPress, scale]);

  return (
    <>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.75}
          delayLongPress={300}
          onLongPress={handleLongPress}
          onPress={logged ? onEditPress : onAddPress}
        >
          <View style={styles.left}>
            <Text style={logged ? styles.mealTypeFilled : styles.mealTypeEmpty}>
              {mealType}
            </Text>
            {logged && foodName ? (
              <>
                <Text style={styles.foodName} numberOfLines={1}>{foodName}</Text>
                {macros && <MacroLine macros={macros} />}
              </>
            ) : (
              <Text style={styles.emptyHint}>Tap to log</Text>
            )}
          </View>

          <View style={styles.right}>
            {logged && (
              <Text style={styles.calories}>{calories} kcal</Text>
            )}
            <View style={styles.actionBtn}>
              {logged ? <EditIcon /> : <PlusIcon />}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
      {!isLast && <View style={styles.divider} />}
    </>
  );
}

export default function LogMealCard({
  loggedMeals = [],
  onAddMeal,
  onLongPressMeal,
}: {
  loggedMeals?: any[];
  onAddMeal?: () => void;
  onLongPressMeal?: (meal: any) => void;
}) {
  const baseSlots = ['Breakfast', 'Lunch', 'Dinner', 'Morning snack', 'Afternoon snack', 'Evening snack'];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Meal logs</Text>
      <View style={styles.list}>
        {baseSlots.map((slotName, index) => {
          const foundMeal = loggedMeals.find(
            (m) =>
              m.name.toLowerCase() === slotName.toLowerCase() ||
              (slotName.toLowerCase().includes('snack') && m.type === 'snack')
          );

          return (
            <LogMealRow
              key={slotName}
              mealType={slotName}
              foodName={foundMeal?.description}
              calories={foundMeal?.calories ?? 0}
              macros={foundMeal?.macros
                ? { protein: foundMeal.macros.protein, carbs: foundMeal.macros.carbs, fat: foundMeal.macros.fat }
                : undefined}
              isLast={index === baseSlots.length - 1}
              logged={!!foundMeal}
              onAddPress={onAddMeal}
              onEditPress={foundMeal ? () => onLongPressMeal?.(foundMeal) : undefined}
              onLongPress={foundMeal ? () => onLongPressMeal?.(foundMeal) : undefined}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    paddingTop: 20,
    paddingBottom: 8,
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  left: {
    flex: 1,
    gap: 3,
    paddingRight: 12,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  mealTypeFilled: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  mealTypeEmpty: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  foodName: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginTop: 1,
  },
  emptyHint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  macroLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  macroLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  macroValue: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  macroDot: {
    fontSize: 11,
    color: Colors.border,
  },
  calories: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent,
  },
  actionBtn: {
    padding: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
});
