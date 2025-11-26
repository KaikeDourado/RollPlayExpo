import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoginForm from '../../components/auth/LoginForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginPage() {
  return (
    <LinearGradient
      colors={['#0E0F29', '#0C0D24']}
      style={styles.container}
    >
      <View style={styles.contentBox}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formBox}>
            <LoginForm />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBox: {
    width: '100%',
    paddingHorizontal: 20,
  },
});
