import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import { OnboardingProvider, useOnboarding } from './src/context/OnboardingContext';
import { RecipeProvider } from './src/context/RecipeContext';
import { ComboProvider } from './src/context/ComboContext';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';
import AppNavigator from './src/navigation/AppNavigator';

function Root() {
  const { isOnboarded, loading } = useOnboarding();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return isOnboarded ? <AppNavigator /> : <OnboardingNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        <RecipeProvider>
          <ComboProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              <Root />
            </NavigationContainer>
          </ComboProvider>
        </RecipeProvider>
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}
