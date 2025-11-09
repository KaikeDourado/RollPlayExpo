import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from '../components/navigation/BottomTabNavigator';
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
    <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="MainTabs" 
        component={BottomTabNavigator} 
      />
      <Stack.Screen 
        name="ProfileSession" 
        component={ProfileSessionPage}
      />
      <Stack.Screen 
        name="Sheet" 
        component={SheetPage}
      />
    </Stack.Navigator>
  );
}

export default AppStack;