import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from './src/lib/tokenCache';
import { OnboardingProvider, useOnboarding } from './src/context/OnboardingContext';
import { RecipeProvider } from './src/context/RecipeContext';
import { ComboProvider } from './src/context/ComboContext';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function Root() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { isOnboarded, loading: onboardingLoading } = useOnboarding();

  if (!authLoaded || onboardingLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (!isSignedIn) return <AuthNavigator />;
  if (!isOnboarded) return <OnboardingNavigator />;
  return <AppNavigator />;
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <ClerkLoaded>
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
      </ClerkLoaded>
    </ClerkProvider>
  );
}
