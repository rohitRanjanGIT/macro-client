import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';
import { Colors } from '../constants/colors';
import HomeScreen from '../screens/HomeScreen';
import PrepScreen from '../screens/PrepScreen';
import ScanScreen from '../screens/ScanScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SocialScreen from '../screens/SocialScreen';

const Tab = createBottomTabNavigator();

function HomeIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

function PrepIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="2" />
      <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" />
      <Line x1="8" y1="3" x2="8" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="16" y1="3" x2="16" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function ScanIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7V5a2 2 0 012-2h2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M17 3h2a2 2 0 012 2v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M21 17v2a2 2 0 01-2 2h-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M7 21H5a2 2 0 01-2-2v-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Rect x="7" y="7" width="4" height="4" stroke={color} strokeWidth="1.5" />
      <Rect x="13" y="7" width="4" height="4" stroke={color} strokeWidth="1.5" />
      <Rect x="7" y="13" width="4" height="4" stroke={color} strokeWidth="1.5" />
      <Rect x="13" y="13" width="4" height="4" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

function ProgressIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 17l4-4 4 4 4-8 6 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SocialIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
      <Path
        d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Prep"
        component={PrepScreen}
        options={{
          tabBarIcon: ({ color, size }) => <PrepIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ScanIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ProgressIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Social"
        component={SocialScreen}
        options={{
          tabBarIcon: ({ color, size }) => <SocialIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
