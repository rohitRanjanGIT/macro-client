import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import GraphToggle from '../../components/GraphToggle';
import StreakRow from './StreakRow';
import CalorieGraph from './CalorieGraph';
import MacroGraph from './MacroGraph';
import SummaryStats from './SummaryStats';
import GoalProgress from './GoalProgress';
import InsightCard from './InsightCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;

// ─── Dummy Data ─────────────────────────────────────────────────────────────

const WEEKLY_DATA = [
  { day: 'Mon', calories: 2050, protein: 95, carbs: 220, fat: 68 },
  { day: 'Tue', calories: 1870, protein: 112, carbs: 195, fat: 55 },
  { day: 'Wed', calories: 2240, protein: 88, carbs: 248, fat: 78 },
  { day: 'Thu', calories: 1950, protein: 130, carbs: 200, fat: 60 },
  { day: 'Fri', calories: 2380, protein: 102, carbs: 270, fat: 82 },
  { day: 'Sat', calories: 2710, protein: 95, carbs: 310, fat: 92 },
  { day: 'Sun', calories: 1284, protein: 86, carbs: 148, fat: 35 },
];

// Seeded monthly data (deterministic, no Math.random)
const MONTHLY_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  calories: 1700 + ((i * 137 + 53) % 800),
  protein: 80 + ((i * 43 + 17) % 60),
  carbs: 170 + ((i * 67 + 29) % 100),
  fat: 50 + ((i * 31 + 11) % 50),
}));

const CALORIE_GOAL = 2100;
const WEEKLY_GOAL = CALORIE_GOAL * 7;

const STREAK_STATUSES = [true, true, true, true, false, true, true];
const TODAY_INDEX = 6; // Sunday

const INSIGHTS: Array<{
  type: 'warning' | 'tip' | 'success';
  icon: string;
  title: string;
  subtitle: string;
}> = [
  {
    type: 'warning',
    icon: '🔥',
    title: 'Weekend Calorie Spike',
    subtitle:
      'You are averaging 2,710 kcal on Saturdays—well above your 2,100 limit. Try planning a lighter dinner to stay on track.',
  },
  {
    type: 'tip',
    icon: '💪',
    title: 'Protein Opportunity',
    subtitle:
      'Your week-day protein is 15% below target. Adding a quick bowl of Dal or Paneer at lunch will easily fix this.',
  },
];

// ─── Section Label ───────────────────────────────────────────────────────────

function SectionLabel({ title }: { title: string }) {
  return <Text style={sectionStyles.label}>{title}</Text>;
}

const sectionStyles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 24,
  },
});

// ─── Graph Pager (swipeable) ─────────────────────────────────────────────────

function GraphPager({
  data,
  goal,
}: {
  data: typeof WEEKLY_DATA;
  goal: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const graphs = [
    <CalorieGraph data={data} goal={goal} />,
    <MacroGraph data={data} />
  ];

  return (
    <View>
      {/* Horizontal pager with Animated scale/opacity pop */}
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.pagerContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: true,
            listener: (e: any) => {
              const page = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
              if (page !== activeIndex) {
                setActiveIndex(page);
              }
            },
          }
        )}
      >
        {graphs.map((Child, index) => {
          const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            (index + 1) * CARD_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.93, 1, 0.93],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View 
              key={index} 
              style={{ width: CARD_WIDTH, transform: [{ scale }], opacity }}
            >
              {Child}
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      {/* Page dots */}
      <View style={styles.dotsRow}>
        {[0, 1].map((i) => {
          const dotInputRange = [
            (i - 1) * CARD_WIDTH,
            i * CARD_WIDTH,
            (i + 1) * CARD_WIDTH,
          ];
          const dotScale = scrollX.interpolate({
            inputRange: dotInputRange,
            outputRange: [1, 1.4, 1],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                activeIndex === i ? styles.dotActive : styles.dotInactive,
                { transform: [{ scale: dotScale }] }
              ]}
            />
          );
        })}
      </View>

      {/* Dynamic Legend */}
      <View style={styles.legendRow}>
        {activeIndex === 0 ? (
          <>
            <View style={[styles.legendDot, { backgroundColor: Colors.accent }]} />
            <Text style={styles.legendText}>Under Goal</Text>
            <View style={[styles.legendDot, { backgroundColor: Colors.danger, marginLeft: 16 }]} />
            <Text style={styles.legendText}>Over Goal</Text>
          </>
        ) : (
          <>
            <View style={[styles.legendDot, { backgroundColor: Colors.calorieRingProtein }]} />
            <Text style={styles.legendText}>Protein</Text>
            <View style={[styles.legendDot, { backgroundColor: Colors.calorieRingCarbs, marginLeft: 16 }]} />
            <Text style={styles.legendText}>Carbs</Text>
            <View style={[styles.legendDot, { backgroundColor: Colors.calorieRingFat, marginLeft: 16 }]} />
            <Text style={styles.legendText}>Fat</Text>
          </>
        )}
      </View>
    </View>
  );
}

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState('weekly');

  const isWeekly = range === 'weekly';
  const sourceData = isWeekly ? WEEKLY_DATA : MONTHLY_DATA;
  const daysTotalLabel = isWeekly ? '/ 7' : '/ 30';

  // Dynamic stats calculated from raw 7-day or 30-day source
  const avgCalories = Math.round(sourceData.reduce((s, d) => s + d.calories, 0) / sourceData.length);
  const daysOnTarget = sourceData.filter((d) => d.calories <= CALORIE_GOAL).length;
  const bestDay = Math.min(...sourceData.map((d) => d.calories));
  const worstDay = Math.max(...sourceData.map((d) => d.calories));

  // Determine graph layout (prevent 30 bars by using weekly avgs for month)
  let graphData;
  if (isWeekly) {
    graphData = sourceData;
  } else {
    // Generate 4 weekly averages to prevent crowding
    const weekChunks = [
      sourceData.slice(0, 7),
      sourceData.slice(7, 14),
      sourceData.slice(14, 21),
      sourceData.slice(21, 30), // last chunk captures 9 days
    ];
    graphData = weekChunks.map((chunk, i) => {
      const denom = chunk.length;
      return {
        day: `Wk ${i + 1}`,
        calories: chunk.reduce((s, d) => s + d.calories, 0) / denom,
        protein: chunk.reduce((s, d) => s + d.protein, 0) / denom,
        carbs: chunk.reduce((s, d) => s + d.carbs, 0) / denom,
        fat: chunk.reduce((s, d) => s + d.fat, 0) / denom,
      };
    });
  }

  const totalConsumed = sourceData.reduce((s, d) => s + d.calories, 0);
  const goalToCompare = isWeekly ? WEEKLY_GOAL : CALORIE_GOAL * 30;
  const daysRemaining = isWeekly ? 1 : 0; // arbitrary placeholder

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.heading}>Progress</Text>
      <Text style={styles.subheading}>Track your nutritional trends and streaks.</Text>

      {/* 1 — Streak */}
      <SectionLabel title="Streak" />
      <StreakRow
        streak={12}
        statuses={STREAK_STATUSES}
        todayIndex={TODAY_INDEX}
      />

      {/* 2 — Trends */}
      <SectionLabel title="Trends" />
      <GraphToggle selected={range} onChange={setRange} />
      
      {/* Summary stats directly below toggle */}
      <View style={{ marginBottom: 24 }}>
        <SummaryStats
          avgCalories={avgCalories.toLocaleString('en-US')}
          daysOnTarget={daysOnTarget.toString()}
          daysTotal={daysTotalLabel}
          bestDay={bestDay.toLocaleString('en-US')}
          worstDay={worstDay.toLocaleString('en-US')}
        />
      </View>

      <GraphPager data={graphData} goal={CALORIE_GOAL} />

      {/* 4 — Goal Progress */}
      <SectionLabel title={isWeekly ? 'Weekly Goal' : 'Monthly Goal'} />
      <GoalProgress
        consumed={totalConsumed}
        goal={goalToCompare}
        daysRemaining={daysRemaining}
        label={isWeekly ? 'Weekly Calorie Goal' : 'Monthly Calorie Goal'}
      />

      {/* 5 — Insights */}
      <SectionLabel title="Insights" />
      {INSIGHTS.map((insight, i) => (
        <InsightCard key={i} {...insight} />
      ))}
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
    paddingBottom: 30,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
    marginTop: 14,
  },
  subheading: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 4,
  },
  pagerContent: {
    gap: 0,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dotActive: {
    backgroundColor: Colors.accent,
  },
  dotInactive: {
    backgroundColor: Colors.border,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 8,
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
