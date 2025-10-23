
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import RegisterForm from '../../components/auth/RegisterForm'; // Ajustar o caminho conforme a estrutura de pastas
import { ScrollView } from 'react-native';
// Importe um ícone de check para React Native, por exemplo, de '@expo/vector-icons'
// import { Feather } from '@expo/vector-icons';

/**
 * @function RegisterPage
 * @description Tela de Registro do aplicativo.
 * Adaptada do projeto React original, convertendo elementos HTML para componentes React Native
 * e ajustando o estilo para mobile.
 */
export default function RegisterPage() {
  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require("../../../assets/group_image_background.webp")} // Caminho ajustado para assets
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.contentBox}>
          <View style={styles.textBox}>
            <Text style={styles.title}>SUA AVENTURA COMEÇA AQUI</Text>         
          </View>
          <View style={styles.formBox}>
            <RegisterForm />
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
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
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
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
    marginBottom: 50,
  },
});

