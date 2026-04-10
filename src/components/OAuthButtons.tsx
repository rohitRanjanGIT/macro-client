import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Colors } from '../constants/colors';

// Warm up the android browser to improve UX
WebBrowser.maybeCompleteAuthSession();

export function OAuthButtons() {
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });
  const [loading, setLoading] = React.useState<string | null>(null);

  const onPress = React.useCallback(async (strategy: 'oauth_google' | 'oauth_apple') => {
    try {
      setLoading(strategy);
      const startFlow = strategy === 'oauth_google' ? startGoogleOAuthFlow : startAppleOAuthFlow;
      
      const { createdSessionId, setActive } = await startFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'macroclient' }),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error('OAuth error', err);
    } finally {
      setLoading(null);
    }
  }, [startGoogleOAuthFlow, startAppleOAuthFlow]);

  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity
        style={styles.providerButton}
        onPress={() => onPress('oauth_google')}
        disabled={loading !== null}
      >
        {loading === 'oauth_google' ? (
          <ActivityIndicator color={Colors.text} />
        ) : (
          <Text style={styles.providerButtonText}>Continue with Google</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.providerButton}
        onPress={() => onPress('oauth_apple')}
        disabled={loading !== null}
      >
        {loading === 'oauth_apple' ? (
          <ActivityIndicator color={Colors.text} />
        ) : (
          <Text style={styles.providerButtonText}>Continue with Apple</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    gap: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  providerButton: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  providerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});
