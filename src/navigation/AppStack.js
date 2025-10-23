
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from '../screens/HomePage';
import ProfilePage from '../screens/ProfilePage';
import ProfileSessionPage from '../screens/ProfileSessionPage';
import SheetPage from '../screens/SheetPage';

const Stack = createStackNavigator();

/**
 * @function AppStack
 * @description Define a pilha de navegação para as telas principais do aplicativo, acessíveis após o login.
 * Todas as telas nesta pilha não terão cabeçalho padrão, proporcionando um controle total sobre o layout.
 */
function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="ProfileSession" component={ProfileSessionPage} />
      <Stack.Screen name="Sheet" component={SheetPage} />
    </Stack.Navigator>
  );
}

export default AppStack;

