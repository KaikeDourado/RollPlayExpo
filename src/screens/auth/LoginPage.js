
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import LoginForm from '../../components/auth/LoginForm'; // Ajustar o caminho conforme a estrutura de pastas

/**
 * @function LoginPage
 * @description Tela de Login do aplicativo.
 * Adaptada do projeto React original, convertendo elementos HTML para componentes React Native
 * e ajustando o estilo para mobile.
 */
export default function LoginPage() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/maga_estudando_background.png")} // Caminho ajustado para assets
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.contentBox}>
          <View style={styles.textBox}>
            <Text style={styles.title}>SUA AVENTURA COMEÇA AQUI</Text>
            <Text style={styles.description}>
              ROLL & PLAY É UMA PLATAFORMA GRATUITA PARA JOGADORES DE RPG DE MESA.
              CRIE PERSONAGENS, ORGANIZE SESSÕES E ROLE DADOS - TUDO EM UM SÓ LUGAR.
            </Text>
          </View>
          <View style={styles.formBox}>
            <LoginForm />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Escurecer a imagem de fundo para melhor contraste
  },
  contentBox: {
    flex: 1,
    width: '90%', // Ajustar largura para mobile
    maxWidth: 400, // Limitar largura em telas maiores
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
  },
  formBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

