import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../screens/auth/LoginPage';
import RegisterPage from '../screens/auth/RegisterPage';
import WelcomePage from '../screens/auth/WelcomePage';


const Stack = createStackNavigator();

/**
 * @function AuthStack
 * @description Define a pilha de navegação para as telas de autenticação (Login e Registro).
 * As telas nesta pilha não terão cabeçalho padrão, proporcionando um controle total sobre o layout.
 */
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomePage} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterPage} />
    </Stack.Navigator>
  );
}

export default AuthStack;
