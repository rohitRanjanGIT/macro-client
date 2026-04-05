import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface StatsRowProps {
  eaten: number;
  remaining: number;
  waterGlasses: number;
  onAddWater: () => void;
  onLongPressWater?: () => void;
}

export default function StatsRow({ eaten, remaining, waterGlasses, onAddWater, onLongPressWater }: StatsRowProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.cardBorder]}>
        <Text style={styles.label}>EATEN</Text>
        <Text style={[styles.value, { color: Colors.text }]}>{eaten.toLocaleString()}</Text>
      </View>
      <View style={[styles.card, styles.cardBorder]}>
        <Text style={styles.label}>REMAINING</Text>
        <Text style={[styles.value, { color: Colors.remaining }]}>{remaining.toLocaleString()}</Text>
      </View>
      <TouchableOpacity style={styles.card} onPress={onAddWater} onLongPress={onLongPressWater} activeOpacity={0.7}>
        <Text style={styles.label}>WATER</Text>
        <View style={styles.waterRow}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z"
              stroke="#3B82F6"
              strokeWidth="2"
              fill="#3B82F620"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.waterValue}>{waterGlasses}</Text>
          <Text style={styles.waterPlus}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cardBorder: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
  waterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  waterValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3B82F6',
  },
  waterPlus: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textMuted,
    marginLeft: 2,
  },
});
