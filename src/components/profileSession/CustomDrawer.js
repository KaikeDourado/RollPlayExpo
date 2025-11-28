import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const CustomDrawer = ({ isVisible, onClose, activeTab, setActiveTab, campaignData }) => {
  const menuItems = [
    { name: 'GERAL', label: 'Geral', icon: '📊', description: 'Visão geral da campanha' },
    { name: 'JOGADORES', label: 'Jogadores', icon: '⚔️', description: 'Gerenciar jogadores' },
    { name: 'SESSÕES', label: 'Sessões', icon: '📖', description: 'Histórico de sessões' },
    { name: 'NOTAS', label: 'Notas', icon: '📝', description: 'Anotações importantes' },
    { name: 'MAPAS', label: 'Mapas', icon: '🗺️', description: 'Mapas e localidades' },
    { name: 'NPCS', label: 'NPCs', icon: '🧙', description: 'Personagens não-jogadores' },
  ];

  if (!isVisible) return null;

  return (
    <TouchableOpacity 
      style={styles.overlay} 
      activeOpacity={1} 
      onPress={onClose}
    >
      <TouchableOpacity 
        style={styles.drawer} 
        activeOpacity={1}
        onPress={(e) => e.stopPropagation()}
      >
        {/* Header do Drawer */}
        <View style={styles.drawerHeader}>
          <View style={styles.campaignIconContainer}>
            <Text style={styles.campaignIcon}>🎲</Text>
          </View>
          <View style={styles.campaignInfo}>
            <Text style={styles.campaignName} numberOfLines={2}>
              {campaignData?.name || 'Campanha'}
            </Text>
            <Text style={styles.campaignSystem}>
              {campaignData?.system || 'D&D 5e'}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <ScrollView 
          style={styles.menuContainer}
          showsVerticalScrollIndicator={false}
        >
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
              <View style={styles.menuItemContent}>
                <View style={[
                  styles.menuIconContainer,
                  activeTab === item.name && styles.activeMenuIconContainer
                ]}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[
                    styles.menuLabel,
                    activeTab === item.name && styles.activeMenuLabel
                  ]}>
                    {item.label}
                  </Text>
                  <Text style={[
                    styles.menuDescription,
                    activeTab === item.name && styles.activeMenuDescription
                  ]}>
                    {item.description}
                  </Text>
                </View>
              </View>
              {activeTab === item.name && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.drawerFooter}>
          <View style={styles.footerStats}>
            <View style={styles.footerStat}>
              <Text style={styles.footerStatValue}>
                {campaignData?.players?.length || 0}
              </Text>
              <Text style={styles.footerStatLabel}>Jogadores</Text>
            </View>
            <View style={styles.footerDivider} />
            <View style={styles.footerStat}>
              <Text style={styles.footerStatValue}>
                {campaignData?.sessionsCount || 0}
              </Text>
              <Text style={styles.footerStatLabel}>Sessões</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#1a1f3a',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerHeader: {
    backgroundColor: '#0a0e27',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3653',
    flexDirection: 'row',
    alignItems: 'center',
  },
  campaignIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a1f3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#2d3653',
  },
  campaignIcon: {
    fontSize: 24,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  campaignSystem: {
    fontSize: 13,
    color: '#3b9dff',
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2d3653',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: '700',
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  activeMenuItem: {
    backgroundColor: '#0a0e27',
    borderLeftColor: '#3b9dff',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  activeMenuIconContainer: {
    backgroundColor: '#3b9dff',
    borderColor: '#3b9dff',
  },
  menuIcon: {
    fontSize: 22,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 2,
  },
  activeMenuLabel: {
    color: '#ffffff',
  },
  menuDescription: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeMenuDescription: {
    color: '#9ca3af',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b9dff',
    marginLeft: 8,
  },
  drawerFooter: {
    backgroundColor: '#0a0e27',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2d3653',
  },
  footerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerStat: {
    alignItems: 'center',
    flex: 1,
  },
  footerStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#3b9dff',
    marginBottom: 4,
  },
  footerStatLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#2d3653',
  },
});

export default CustomDrawer;