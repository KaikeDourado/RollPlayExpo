import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const AtaquesMagiasSection = ({ weapons, spellcasting, editMode, onSave }) => {
  const [activeTab, setActiveTab] = useState("ataques");

  const handleRemoveWeapon = (index) => {
    if (editMode && onSave) {
      Alert.alert(
        'Remover Arma',
        'Deseja realmente remover esta arma?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Remover',
            style: 'destructive',
            onPress: () => {
              const updatedWeapons = weapons.filter((_, i) => i !== index);
              onSave({ weapons: updatedWeapons });
            }
          }
        ]
      );
    }
  };

  const handleSpellcastingChange = (field, value) => {
    if (editMode && onSave) {
      const updatedSpellcasting = { ...spellcasting, [field]: value };
      onSave({ spellcasting: updatedSpellcasting });
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>⚔️</Text>
        <Text style={styles.title}>Ataques e Magias</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "ataques" && styles.activeTab]}
          onPress={() => setActiveTab("ataques")}
        >
          <Text style={[styles.tabText, activeTab === "ataques" && styles.activeTabText]}>
            Ataques
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "magias" && styles.activeTab]}
          onPress={() => setActiveTab("magias")}
        >
          <Text style={[styles.tabText, activeTab === "magias" && styles.activeTabText]}>
            Magias
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo Ataques */}
      {activeTab === "ataques" && (
        <View style={styles.content}>
          {weapons.length > 0 ? (
            weapons.map((weapon, index) => (
              <View key={index} style={styles.weaponCard}>
                <View style={styles.weaponHeader}>
                  <Text style={styles.weaponName}>{weapon.name}</Text>
                  {editMode && (
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => handleRemoveWeapon(index)}
                    >
                      <Text style={styles.removeBtnText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.weaponDetails}>
                  <View style={styles.weaponStat}>
                    <Text style={styles.weaponStatLabel}>Bônus/CD</Text>
                    <Text style={styles.weaponStatValue}>{weapon.bonusOrDC}</Text>
                  </View>
                  <View style={styles.weaponDivider} />
                  <View style={styles.weaponStat}>
                    <Text style={styles.weaponStatLabel}>Dano</Text>
                    <Text style={styles.weaponStatValue}>{weapon.damageType}</Text>
                  </View>
                </View>
                {weapon.notes && (
                  <View style={styles.weaponNotes}>
                    <Text style={styles.weaponNotesText}>📌 {weapon.notes}</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhuma arma/ataque cadastrado.</Text>
          )}
        </View>
      )}

      {/* Conteúdo Magias */}
      {activeTab === "magias" && (
        <View style={styles.content}>
          {spellcasting.hasSpellcasting ? (
            <View>
              {/* Stats de Conjuração */}
              <View style={styles.spellStats}>
                <View style={styles.spellStat}>
                  <Text style={styles.spellStatLabel}>Habilidade</Text>
                  <Text style={styles.spellStatValue}>
                    {spellcasting.spellcastingAbility || 'N/A'}
                  </Text>
                </View>
                <View style={styles.spellStat}>
                  <Text style={styles.spellStatLabel}>CD Resistir</Text>
                  <Text style={styles.spellStatValue}>
                    {spellcasting.spellSaveDC || 'N/A'}
                  </Text>
                </View>
                <View style={styles.spellStat}>
                  <Text style={styles.spellStatLabel}>Bônus Ataque</Text>
                  <Text style={styles.spellStatValue}>
                    {spellcasting.spellAttackBonus || 'N/A'}
                  </Text>
                </View>
              </View>

              {/* Magias por Nível */}
              <Text style={styles.sectionTitle}>Magias Conhecidas</Text>
              {Object.entries(spellcasting.spellsByLevel).map(([level, data]) =>
                data.spells.length > 0 ? (
                  <View key={level} style={styles.spellLevel}>
                    <View style={styles.spellLevelHeader}>
                      <Text style={styles.spellLevelTitle}>Nível {level}</Text>
                      <Text style={styles.spellSlots}>
                        {data.slots.expended}/{data.slots.total} slots
                      </Text>
                    </View>
                    <Text style={styles.spellList}>
                      {data.spells.map((s) => s.name).join(', ')}
                    </Text>
                  </View>
                ) : null
              )}

              {/* Notas */}
              {spellcasting.spellNotes && (
                <View style={styles.notesSection}>
                  <Text style={styles.sectionTitle}>Notas de Conjuração</Text>
                  <Text style={styles.notesText}>{spellcasting.spellNotes}</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Este personagem não possui habilidades de conjuração.
              </Text>
              {editMode && (
                <TouchableOpacity
                  style={styles.enableBtn}
                  onPress={() => handleSpellcastingChange('hasSpellcasting', true)}
                >
                  <Text style={styles.enableBtnText}>Habilitar Conjuração</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3653',
  },
  icon: { fontSize: 20, marginRight: 10 },
  title: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#0a0e27',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3b9dff',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9ca3af',
  },
  activeTabText: {
    color: '#ffffff',
  },

  content: {
    gap: 12,
  },

  // Weapons
  weaponCard: {
    backgroundColor: '#0a0e27',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  weaponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weaponName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  weaponDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weaponStat: {
    flex: 1,
  },
  weaponStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  weaponStatValue: {
    fontSize: 16,
    color: '#3b9dff',
    fontWeight: '700',
  },
  weaponDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#2d3653',
    marginHorizontal: 12,
  },
  weaponNotes: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2d3653',
  },
  weaponNotesText: {
    fontSize: 13,
    color: '#9ca3af',
  },

  // Spells
  spellStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0a0e27',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  spellStat: {
    alignItems: 'center',
  },
  spellStatLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 6,
    fontWeight: '600',
  },
  spellStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3b9dff',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    marginTop: 8,
  },
  spellLevel: {
    backgroundColor: '#0a0e27',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#3b9dff',
  },
  spellLevelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  spellLevelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3b9dff',
  },
  spellSlots: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '600',
  },
  spellList: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  notesSection: {
    marginTop: 16,
  },
  notesText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    backgroundColor: '#0a0e27',
    padding: 12,
    borderRadius: 8,
  },

  // Empty states
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  enableBtn: {
    backgroundColor: '#3b9dff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  enableBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default AtaquesMagiasSection;