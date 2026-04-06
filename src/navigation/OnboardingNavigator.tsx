import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import GoalScreen from '../screens/onboarding/GoalScreen';
import AboutYouScreen from '../screens/onboarding/AboutYouScreen';
import ActivityLevelScreen from '../screens/onboarding/ActivityLevelScreen';
import PlanResultScreen from '../screens/onboarding/PlanResultScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#1A1A2E' },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Goal" component={GoalScreen} />
      <Stack.Screen name="AboutYou" component={AboutYouScreen} />
      <Stack.Screen name="ActivityLevel" component={ActivityLevelScreen} />
      <Stack.Screen name="PlanResult" component={PlanResultScreen} />
    </Stack.Navigator>
  );
}
