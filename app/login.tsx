import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInView, ScalePressable } from '@/components/ui/motion';
import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { useAuth } from '@/contexts/auth-context';
import { validateLoginInput } from '@/lib/auth-validation';

export default function LoginScreen() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user]);

  const submit = async () => {
    setError('');
    const validationError = validateLoginInput(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        router.replace('/');
      } else {
        setError(result.error ?? 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <FadeInView index={0}>
            <Text style={styles.logo}>Finesse</Text>
            <Text style={styles.welcome}>
              Hello, <Text style={styles.accent}>welcome!</Text>
            </Text>
            <Text style={styles.tagline}>Crafting timeless elegance, one piece at a time.</Text>
          </FadeInView>

          <FadeInView index={1} style={styles.card}>
            <Text style={styles.cardTitle}>Sign in</Text>
            {error ? <Text style={styles.err}>{error}</Text> : null}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={FinesseColors.textLight}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={FinesseColors.textLight}
            />
            <ScalePressable
              style={[styles.btn, loading && { opacity: 0.75 }]}
              onPress={submit}
              disabled={loading}
              haptic={!loading}>
              {loading ? (
                <ActivityIndicator color={FinesseColors.secondary} />
              ) : (
                <Text style={styles.btnTxt}>LOGIN</Text>
              )}
            </ScalePressable>
            <Pressable onPress={() => router.push('/signup')} style={styles.linkRow}>
              <Text style={styles.link}>Need an account? Sign up</Text>
            </Pressable>
            <Pressable onPress={() => router.back()} style={styles.back}>
              <Text style={styles.backTxt}>← Back</Text>
            </Pressable>
          </FadeInView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: FinesseColors.backgroundAlt },
  flex: { flex: 1 },
  scroll: { padding: 24, paddingTop: 16 },
  logo: {
    fontFamily: FinesseFonts.serif,
    fontSize: 40,
    color: FinesseColors.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  welcome: {
    fontFamily: FinesseFonts.serif,
    fontSize: 28,
    color: FinesseColors.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  accent: { color: FinesseColors.primaryDark },
  tagline: {
    fontFamily: FinesseFonts.sansLight,
    fontSize: 15,
    color: FinesseColors.textLight,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  card: {
    backgroundColor: FinesseColors.background,
    borderRadius: 8,
    padding: 22,
    borderWidth: 1,
    borderColor: FinesseColors.border,
  },
  cardTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 26,
    color: FinesseColors.secondary,
    marginBottom: 16,
  },
  err: {
    fontFamily: FinesseFonts.sans,
    color: '#b00020',
    marginBottom: 12,
  },
  label: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 12,
    color: FinesseColors.text,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: FinesseColors.border,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: FinesseFonts.sans,
    fontSize: 16,
    marginBottom: 16,
    color: FinesseColors.text,
    backgroundColor: FinesseColors.backgroundAlt,
  },
  btn: {
    backgroundColor: FinesseColors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 2,
    marginTop: 4,
  },
  btnTxt: {
    fontFamily: FinesseFonts.sansMedium,
    letterSpacing: 2,
    color: FinesseColors.secondary,
  },
  linkRow: { marginTop: 20, alignItems: 'center' },
  link: {
    fontFamily: FinesseFonts.sans,
    color: FinesseColors.primaryDark,
    textDecorationLine: 'underline',
  },
  back: { marginTop: 16, alignItems: 'center' },
  backTxt: { fontFamily: FinesseFonts.sans, color: FinesseColors.textLight },
});
