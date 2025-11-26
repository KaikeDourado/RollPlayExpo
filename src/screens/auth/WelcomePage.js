import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';

/**
 * @function WelcomePage
 * @description Tela de boas-vindas onde o usuário escolhe entre fazer login ou cadastro.
 */
export default function WelcomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/maga_estudando_background.png")}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.contentBox}>
          <View style={styles.headerBox}>
            <Text style={styles.mainTitle}>ROLL & PLAY</Text>
            <Text style={styles.mainSubtitle}>RPG DE MESA ONLINE</Text>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.description}>
              Crie personagens, organize sessões e role dados - tudo em um só lugar.
            </Text>
          </View>

          {/* Botões de Ação */}
          <View style={styles.buttonsBox}>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>FAZER LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>CRIAR CONTA</Text>
            </TouchableOpacity>
          </View>

          {/* Footer com informações */}
          <View style={styles.footerBox}>
            <Text style={styles.footerText}>
              Plataforma perfeita para jogadores de RPG de mesa
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Overlay mais escuro
  },
  contentBox: {
    flex: 1,
    width: '85%',
    maxWidth: 400,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  headerBox: {
    alignItems: 'center',
    marginTop: 30,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 2,
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    letterSpacing: 1,
  },
  descriptionBox: {
    alignItems: 'center',
    marginVertical: 30,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  buttonsBox: {
    width: '100%',
    gap: 15,
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  registerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#b0b0b0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});