import React from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext.jsx';
import { AuthProvider } from './src/context/AuthContext.jsx';

export default function App() {
    useEffect(() => {
    // Oculta completamente a barra de navegação
    NavigationBar.setVisibilityAsync('hidden');
  }, []);
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
