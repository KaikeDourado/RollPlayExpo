
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
// Importe um ícone de dado para React Native, por exemplo, de '@expo/vector-icons'
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// Importe um ícone de check para React Native, por exemplo, de '@expo/vector-icons'
// import { Feather } from '@expo/vector-icons';

/**
 * @function RegisterForm
 * @description Componente de formulário de registro para o aplicativo React Native.
 * Adaptado do projeto React original, convertendo elementos HTML para componentes React Native,
 * removendo lógica de backend (axios, alert) e utilizando React Navigation para navegação.
 */
export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (!username || !email || !password) {
        throw new Error('Por favor, preencha todos os campos.');
      }

      if (password !== confirmPassword) {
        throw new Error('As senhas não conferem');
      }

      if (!terms) {
        throw new Error('Você deve aceitar os Termos de Serviço e a Política de Privacidade.');
      }

      const response = await axios.post(
        'https://rollplay-ajejd0eah5dugwej.eastus-01.azurewebsites.net/users/',
        {
          email: email,
          password: password,
          displayName: username
        }
      );

      Alert.alert(
        'Sucesso',
        'Conta criada com sucesso! Por favor, verifique seu e-mail para ativar sua conta.'
      )
      //TODO: Ajustar essa navegação de acordo com o padrão do app
      navigation.navigate('Login');
    } catch (err) {
      console.error('Erro no registro:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Erro ao criar conta. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.header}>
        {/* <MaterialCommunityIcons name="dice-d20" size={48} color="#3b82f6" /> */}
        <Text style={styles.title}>Crie sua conta</Text>
        <Text style={styles.subtitle}>Junte-se a milhares de jogadores de RPG</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome de usuário</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome de usuário"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="seu.email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.note}>A senha deve ter pelo menos 8 caracteres</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.termsContainer} onPress={() => setTerms(!terms)}>
        <View style={[styles.checkbox, terms ? styles.checkboxChecked : null]} />
        <Text style={styles.termsText}>
          Eu concordo com os <Text style={styles.link} onPress={() => Alert.alert('Termos de Serviço', 'Funcionalidade a ser implementada.')}>Termos de Serviço</Text> e{' '}
          <Text style={styles.link} onPress={() => Alert.alert('Política de Privacidade', 'Funcionalidade a ser implementada.')}>Política de Privacidade</Text>
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
       style={[
        styles.registerButton,
        loading && { opacity: 0.7 }
        ]} 
        onPress={handleSubmit}
        disabled={loading}>
        <Text style={styles.registerButtonText}>{loading ? 'Criando conta...' : 'Criar conta gratuita'}</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Já tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  note: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#3b82f6',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  link: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
});

