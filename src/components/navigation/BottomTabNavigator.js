import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../../screens/HomePage';
import ProfilePage from '../../screens/ProfilePage';
import { Text, Image } from 'react-native';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#020717',
          height: 60,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: '#60A5FA',
        tabBarInactiveTintColor: '#ffffffff',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../../assets/home.png')}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
          tabBarLabel: 'Início'
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../../assets/user.png')}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
          tabBarLabel: 'Perfil'
        }}
      />
    </Tab.Navigator>
  );
}