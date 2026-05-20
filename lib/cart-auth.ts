import { router } from 'expo-router';
import { Alert } from 'react-native';

/** Prompt guest users to sign in before cart changes */
export function promptSignInForCart(
  message = 'Create an account or log in to add items to your bag.',
) {
  Alert.alert('Sign in required', message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Log in', onPress: () => router.push('/login') },
    { text: 'Sign up', onPress: () => router.push('/signup') },
  ]);
}
