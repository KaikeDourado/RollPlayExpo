import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const CustomDrawer = ({ isVisible, onClose, activeTab, setActiveTab }) => {
  const menuItems = [
    { name: 'GERAL', label: 'Geral' },
    { name: 'JOGADORES', label: 'Jogadores' },
    { name: 'SESSÕES', label: 'Sessões' },
    { name: 'NOTAS', label: 'Notas' },
    { name: 'MAPAS', label: 'Mapas' },
    { name: 'NPCS', label: 'NPCs' },
  ];

  if (!isVisible) return null;

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={1} 
      onPress={onClose}
    >
      <View style={styles.drawer} onStartShouldSetResponder={() => true}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.menuItem,
              activeTab === item.name && styles.activeMenuItem
            ]}
            onPress={() => {
              setActiveTab(item.name);
              onClose();
            }}
          >
            <Text style={[
              styles.menuText,
              activeTab === item.name && styles.activeMenuText
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activeMenuItem: {
    backgroundColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  activeMenuText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
});

export default CustomDrawer;