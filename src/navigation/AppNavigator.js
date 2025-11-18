import React, { useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

function AppNavigator() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Se o usuário foi desconectado (user passou de algo para null)
    // A navegação automática acontece abaixo
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default AppNavigator;