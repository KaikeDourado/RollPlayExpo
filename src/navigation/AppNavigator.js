
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

/**
 * @function AppNavigator
 * @description Componente principal de navegação que decide qual stack (autenticação ou aplicativo) exibir.
 * Em um cenário real, a lógica de autenticação seria mais robusta, verificando tokens de sessão, etc.
 * Por enquanto, simula um estado de autenticação.
 */
function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null); // Simula o token de autenticação do usuário

  useEffect(() => {
    // Simula a verificação de autenticação ao iniciar o aplicativo
    setTimeout(() => {
      // Em um cenário real, você verificaria um token armazenado (ex: AsyncStorage)
      // const token = await AsyncStorage.getItem("userToken");
      // setUserToken(token);
      setUserToken(null); // Inicia como não autenticado para mostrar a tela de login
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken == null ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;

