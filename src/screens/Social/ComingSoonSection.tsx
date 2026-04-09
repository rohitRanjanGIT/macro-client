import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';

const SKELETON_ROWS = [
  { heights: [60, 60], columns: 2 },
  { heights: [120], columns: 1 },
  { heights: [80, 80], columns: 2 },
  { heights: [50, 50, 50], columns: 3 },
  { heights: [100], columns: 1 },
  { heights: [70, 70], columns: 2 },
  { heights: [90, 90, 90], columns: 3 },
  { heights: [60], columns: 1 },
];

export default function ComingSoonSection() {
  return (
    <View style={styles.container}>

      {/* Skeleton grid — fills the whole background */}
      <View style={styles.skeletonGrid}>
        {SKELETON_ROWS.map((row, i) => (
          <View key={i} style={styles.row}>
            {Array.from({ length: row.columns }).map((_, j) => (
              <View
                key={j}
                style={[styles.skeletonBox, { height: row.heights[j] ?? row.heights[0] }]}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Premium blur overlay via gradient */}
      <LinearGradient
        colors={[
          'rgba(26, 26, 46, 0.55)',
          'rgba(26, 26, 46, 0.30)',
          'rgba(26, 26, 46, 0.55)',
        ]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Frosted center card */}
      <View style={styles.overlay}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>COMING SOON</Text>
        </View>
        <Text style={styles.heading}>Social</Text>
        <Text style={styles.subtitle}>Connect, share progress, and{'\n'}stay accountable together.</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skeletonGrid: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    gap: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  skeletonBox: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  badge: {
    backgroundColor: Colors.accent + '22',
    borderWidth: 1,
    borderColor: Colors.accent + '66',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.5,
  },
  heading: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
