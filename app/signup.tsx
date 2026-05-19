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
import { MIN_PASSWORD_LENGTH, validateSignupInput } from '@/lib/auth-validation';

export default function SignupScreen() {
  const { signup, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
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
    const validationError = validateSignupInput({
      name,
      email,
      password,
      phone,
      city,
      country,
      address,
    });
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const result = await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        city: city.trim(),
        country: country.trim() || undefined,
        address: address.trim() || undefined,
      });
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
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.logo}>Finesse</Text>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.tagline}>
            Tell us a bit about yourself so we can personalize orders and delivery.
          </Text>

          <View style={styles.card}>
            {error ? <Text style={styles.err}>{error}</Text> : null}

            <Text style={styles.sectionTitle}>Account</Text>
            <Text style={styles.sectionHint}>Sign-in details for your boutique profile.</Text>

            <Text style={styles.label}>Full name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={FinesseColors.textLight}
              autoComplete="name"
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={FinesseColors.textLight}
              autoComplete="email"
            />

            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
              placeholderTextColor={FinesseColors.textLight}
              autoComplete="new-password"
            />

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Contact & delivery</Text>
            <Text style={styles.sectionHint}>
              Used for order updates and shipping your jewelry.
            </Text>

            <Text style={styles.label}>Phone number *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+63 912 345 6789"
              placeholderTextColor={FinesseColors.textLight}
              autoComplete="tel"
            />

            <Text style={styles.label}>City / area *</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="e.g. Manila, Quezon City"
              placeholderTextColor={FinesseColors.textLight}
              autoComplete="address-line2"
            />

            <Text style={styles.label}>Country / region</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="e.g. Philippines"
              placeholderTextColor={FinesseColors.textLight}
              autoComplete="country"
            />

            <Text style={styles.label}>Street address</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={address}
              onChangeText={setAddress}
              placeholder="Unit, street, barangay (optional)"
              placeholderTextColor={FinesseColors.textLight}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              autoComplete="street-address"
            />

            <Text style={styles.finePrint}>* Required fields</Text>

            <Pressable
              style={[styles.btn, loading && { opacity: 0.75 }]}
              onPress={submit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color={FinesseColors.background} />
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
  scroll: { padding: 24, paddingTop: 16, paddingBottom: 40 },
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
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: FinesseColors.background,
    borderRadius: 12,
    padding: 22,
    borderWidth: 1,
    borderColor: FinesseColors.border,
  },
  err: {
    fontFamily: FinesseFonts.sans,
    color: '#b00020',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 20,
    color: FinesseColors.secondary,
    marginBottom: 4,
  },
  sectionHint: {
    fontFamily: FinesseFonts.sansLight,
    fontSize: 13,
    color: FinesseColors.textLight,
    lineHeight: 19,
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: FinesseColors.border,
    marginVertical: 20,
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
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: FinesseFonts.sans,
    fontSize: 16,
    marginBottom: 14,
    color: FinesseColors.text,
    backgroundColor: FinesseColors.backgroundAlt,
  },
  inputMultiline: {
    minHeight: 72,
    paddingTop: 12,
  },
  finePrint: {
    fontFamily: FinesseFonts.sans,
    fontSize: 11,
    color: FinesseColors.textLight,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: FinesseColors.secondary,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
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
