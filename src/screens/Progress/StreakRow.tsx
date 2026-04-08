import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Colors } from '../../constants/colors';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface StreakRowProps {
  streak: number;
  statuses: boolean[]; // 7 booleans: hit or miss per day
  todayIndex: number;  // 0-based index of today (0=Mon … 6=Sun)
}

export default function StreakRow({
  streak = 12,
  statuses = [true, true, true, true, false, true, true],
  todayIndex = 6,
}: StreakRowProps) {
  return (
    <Card style={styles.card} mode="contained">
      <Card.Content style={styles.content}>
        {/* Streak count */}
        <View style={styles.countRow}>
          <Text style={styles.fire}>🔥</Text>
          <Text style={styles.count}>{streak}</Text>
          <Text style={styles.label}> day streak</Text>
        </View>
        <Text style={styles.sub}>Keep it going — don't break the chain!</Text>

        {/* Day tiles */}
        <View style={styles.tilesRow}>
          {WEEK_DAYS.map((day, i) => {
            const hit = statuses[i];
            const isToday = i === todayIndex;
            return (
              <View key={day} style={styles.tileWrap}>
                <View
                  style={[
                    styles.circle,
                    hit ? styles.circleHit : styles.circleMiss,
                    isToday && styles.circleToday,
                  ]}
                >
                  {hit && <View style={styles.innerDot} />}
                </View>
                <Text
                  style={[
                    styles.dayLabel,
                    isToday && styles.dayLabelToday,
                  ]}
                >
                  {day}
                </Text>
              </View>
            );
          })}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
  },
  content: {
    padding: 16,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  fire: { fontSize: 26 },
  count: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    marginLeft: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  sub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  tilesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tileWrap: {
    alignItems: 'center',
    gap: 6,
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  circleHit: {
    backgroundColor: '#4ADE8022',
    borderColor: Colors.accent,
  },
  circleMiss: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
  },
  circleToday: {
    borderColor: '#FFFFFF',
    shadowColor: '#4ADE80',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
  },
  dayLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  dayLabelToday: {
    color: Colors.text,
    fontWeight: '700',
  },
});
