import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, Text } from 'react-native';

import HomePage from '../../screens/HomePage';
import ProfilePage from '../../screens/ProfilePage';
import CampaignsPage from '../../screens/CampaignsPage';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#050512',
          height: 75,
          paddingBottom: 12,
          paddingTop: 10,
          borderTopWidth: 0,
          shadowColor: '#00FFFF',
          shadowOpacity: 0.4,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 10,
          elevation: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarActiveTintColor: '#00E6FF',
        tabBarInactiveTintColor: '#ffffff',
      }}
    >

      {/* CAMPANHAS */}
      <Tab.Screen
        name="Campaigns"
        component={CampaignsPage}
        options={{
          tabBarLabel: 'Campanhas',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 8,
              borderRadius: 14,
              backgroundColor: focused ? 'rgba(0, 217, 255, 0.15)' : 'transparent',
              shadowColor: focused ? '#00E6FF' : 'transparent',
              shadowOpacity: focused ? 0.9 : 0,
              shadowRadius: focused ? 10 : 0,
            }}>
              <Image
                source={require('../../../assets/campaigns1.png')}
                style={{
                  width: 28,
                  height: 28,
                  tintColor: color,
                }}
              />
            </View>
          )
        }}
      />

      {/* HOME */}
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 8,
              borderRadius: 14,
              backgroundColor: focused ? 'rgba(0, 217, 255, 0.15)' : 'transparent',
              shadowColor: focused ? '#00E6FF' : 'transparent',
              shadowOpacity: focused ? 0.9 : 0,
              shadowRadius: focused ? 10 : 0,
            }}>
              <Image
                source={require('../../../assets/home.png')}
                style={{
                  width: 28,
                  height: 28,
                  tintColor: color,
                }}
              />
            </View>
          )
        }}
      />

      {/* PERFIL */}
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              padding: 8,
              borderRadius: 14,
              backgroundColor: focused ? 'rgba(0, 217, 255, 0.15)' : 'transparent',
              shadowColor: focused ? '#00E6FF' : 'transparent',
              shadowOpacity: focused ? 0.9 : 0,
              shadowRadius: focused ? 10 : 0,
            }}>
              <Image
                source={require('../../../assets/user.png')}
                style={{
                  width: 28,
                  height: 28,
                  tintColor: color,
                }}
              />
            </View>
          )
        }}
      />

    </Tab.Navigator>
  );
}
