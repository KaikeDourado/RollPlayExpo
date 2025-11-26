import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authApi } from '../../lib/auth';

export default function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (!identifier || !password) {
      setLoading(false);
      return setError('Preencha email e senha');
    }

    try {
      const result = await authApi.signInEmail(identifier, password);
      console.log('signIn result:', result);
    } catch (err) {
      console.error('Login error:', err);
      setError(err?.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* LOGO E TÍTULOS */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/d20.png')}
          style={{ width: 70, height: 70, marginBottom: 10 }}
          resizeMode="contain"
        />

        <Text style={styles.title}>Bem-vindo de volta!</Text>
        <Text style={styles.subtitle}>Entre para continuar sua aventura</Text>
      </View>

      {/* INPUT EMAIL */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="seu.email@exemplo.com"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={identifier}
          onChangeText={setIdentifier}
        />
      </View>

      {/* INPUT SENHA */}
      <View style={styles.inputGroup}>
        <View style={styles.passwordRow}>
          <Text style={styles.label}>Senha</Text>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* CHECKBOX */}
      <TouchableOpacity
        style={styles.rememberMeContainer}
        onPress={() => setRemember(!remember)}
      >
        <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
        </View>
        <Text style={styles.rememberMeText}>Lembrar de mim</Text>
      </TouchableOpacity>

      {/* ERRO */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* BOTÃO */}
      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      {/* REGISTRO */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Não tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}> Registre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },

  /* HEADER */
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: -40,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
  },

  /* INPUTS */
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forgotPassword: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },

  /* CHECKBOX */
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
  },
  rememberMeText: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  /* ERRO */
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },

  /* BOTÃO */
  loginButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  /* REGISTRO */
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#cccccc',
  },
  registerLink: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '700',
  },
});
