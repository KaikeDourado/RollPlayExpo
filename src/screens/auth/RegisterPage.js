import React from 'react';
import { View, StyleSheet } from 'react-native';
import RegisterForm from '../../components/auth/RegisterForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterPage() {
  return (
    <LinearGradient
      colors={['#0E0F29', '#0C0D24']}
      style={styles.container}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentBox}>
          <View style={styles.formBox}>
            <RegisterForm />
          </View>
        </View>
      </KeyboardAwareScrollView>
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
    width: '90%',
    maxWidth: 420,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBox: {
    width: '100%',
  },
});
