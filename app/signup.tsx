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

import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { useAuth } from '@/contexts/auth-context';

export default function SignupScreen() {
  const { signup, user } = useAuth();
  const [name, setName] = useState('');
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
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const result = await signup(name.trim(), email.trim(), password);
      if (result.success) {
        router.replace('/');
      } else {
        setError(result.error ?? 'Signup failed');
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
          <Text style={styles.logo}>Finesse</Text>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.tagline}>Join us for a more personal shopping experience.</Text>

          <View style={styles.card}>
            {error ? <Text style={styles.err}>{error}</Text> : null}
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={FinesseColors.textLight}
            />
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
              placeholder="At least 6 characters"
              placeholderTextColor={FinesseColors.textLight}
            />
            <Pressable
              style={[styles.btn, loading && { opacity: 0.75 }]}
              onPress={submit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color={FinesseColors.secondary} />
              ) : (
                <Text style={styles.btnTxt}>SIGN UP</Text>
              )}
            </Pressable>
            <Pressable onPress={() => router.push('/login')} style={styles.linkRow}>
              <Text style={styles.link}>Already have an account? Log in</Text>
            </Pressable>
            <Pressable onPress={() => router.back()} style={styles.back}>
              <Text style={styles.backTxt}>← Back</Text>
            </Pressable>
          </View>
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
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    fontFamily: FinesseFonts.serif,
    fontSize: 26,
    color: FinesseColors.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontFamily: FinesseFonts.sansLight,
    fontSize: 15,
    color: FinesseColors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  card: {
    backgroundColor: FinesseColors.background,
    borderRadius: 8,
    padding: 22,
    borderWidth: 1,
    borderColor: FinesseColors.border,
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
    backgroundColor: FinesseColors.secondary,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 2,
    marginTop: 4,
  },
  btnTxt: {
    fontFamily: FinesseFonts.sansMedium,
    letterSpacing: 2,
    color: FinesseColors.background,
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
