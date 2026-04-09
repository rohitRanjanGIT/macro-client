import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface LogMealRowProps {
  name: string;
  subtitle?: string;
  calories: number;
  imageUri?: string;
  isLast?: boolean;
  onAddPress?: () => void;
  onLongPress?: () => void;
}

function LogMealRow({ name, subtitle, calories, imageUri, isLast, onAddPress, onLongPress }: LogMealRowProps) {
  return (
    <>
      <TouchableOpacity 
        style={styles.row} 
        activeOpacity={0.7} 
        delayLongPress={300}
        onLongPress={onLongPress}
        onPress={onAddPress}
      >
        <View style={styles.leftContainer}>
          {imageUri ? (
            <View style={styles.imageWrap}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <View style={styles.imageOverlay} />
              <Text style={styles.circleTextOverlay}>
                {calories}{'\n'}kcal
              </Text>
            </View>
          ) : (
            <View style={styles.circle}>
              <Text style={styles.circleText}>
                {calories}{'\n'}kcal
              </Text>
            </View>
          )}
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.name}>{name}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M12 5v14M5 12h14" stroke={Colors.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </TouchableOpacity>
      {!isLast && <View style={styles.divider} />}
    </>
  );
}

export default function LogMealCard({ 
  loggedMeals = [], 
  onAddMeal, 
  onLongPressMeal 
}: { 
  loggedMeals?: any[]; 
  onAddMeal?: () => void; 
  onLongPressMeal?: (meal: any) => void;
}) {
  const baseSlots = ['Breakfast', 'Lunch', 'Dinner', 'Morning snack', 'Afternoon snack', 'Evening snack'];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Log meal</Text>
      <View style={styles.list}>
        {baseSlots.map((slotName, index) => {
          // Find if there's a logged meal that roughly matches this slot
          // Using a simple substring match for 'snack' slots for the demo mock-data
          const foundMeal = loggedMeals.find(m => 
            m.name.toLowerCase() === slotName.toLowerCase() || 
            (slotName.toLowerCase().includes('snack') && m.type === 'snack')
          );

          const calories = foundMeal ? foundMeal.calories : 0;
          const subtitle = foundMeal ? foundMeal.description : (calories > 0 ? 'Quick added calories' : '');
          
          // Using placeholder images for filled items to mimic the design
          const imageUri = foundMeal && slotName === 'Lunch' 
            ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' 
            : undefined;

          return (
            <LogMealRow
              key={slotName}
              name={slotName}
              subtitle={subtitle}
              calories={calories}
              imageUri={imageUri}
              isLast={index === baseSlots.length - 1}
              onAddPress={onAddMeal}
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
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  leftContainer: {
    marginRight: 16,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.background, // Fallback darker circle
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    fontSize: 11,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 14,
  },
  imageWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  circleTextOverlay: {
    color: Colors.text,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 14,
    zIndex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted, 
  },
  addButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 68, 
  },
});
