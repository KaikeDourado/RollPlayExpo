
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';

/**
 * @function AtaquesMagiasSection
 * @description Componente para exibir e gerenciar ataques e magias do personagem.
 * Adaptado do projeto React original para React Native.
 * A funcionalidade de adição/remoção é simulada, pois a lógica de backend foi removida.
 * @param {Array} weapons - Lista de armas/ataques do personagem.
 * @param {object} spellcasting - Objeto contendo os dados de conjuração e magias.
 * @param {boolean} editMode - Indica se a seção está em modo de edição.
 * @param {function} onSave - Função para salvar as alterações (simulada).
 */
const AtaquesMagiasSection = ({ weapons, spellcasting, editMode, onSave }) => {
  const [activeTab, setActiveTab] = useState("ataques");

  // Funções de manipulação de dados (adição/remoção) removidas/simplificadas
  // para focar na exibição dos dados do JSON.

  const handleRemoveWeapon = (index) => {
    if (editMode && onSave) {
      const updatedWeapons = weapons.filter((_, i) => i !== index);
      onSave({ weapons: updatedWeapons }); // Assumindo que onSave espera um objeto para atualizar a seção
    }
  };

  // Função para lidar com a edição de campos de magias (ex: spellcastingAbility)
  const handleSpellcastingChange = (field, value) => {
    if (editMode && onSave) {
      const updatedSpellcasting = { ...spellcasting, [field]: value };
      onSave({ spellcasting: updatedSpellcasting });
    }
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>⚔️</Text>
        <Text style={styles.sectionTitle}>Ataques e Magias</Text>
      </View>

      <View style={styles.ataquesTabs}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "ataques" && styles.activeTabButton]}
          onPress={() => setActiveTab("ataques")}
        >
          <Text style={[styles.tabButtonText, activeTab === "ataques" && styles.activeTabButtonText]}>Ataques</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "magias" && styles.activeTabButton]}
          onPress={() => setActiveTab("magias")}
        >
          <Text style={[styles.tabButtonText, activeTab === "magias" && styles.activeTabButtonText]}>Magias</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "ataques" && (
        <View style={styles.ataquesContent}>
          {weapons.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Nome</Text>
                <Text style={styles.tableHeaderText}>Bônus/CD</Text>
                <Text style={styles.tableHeaderText}>Dano/Tipo</Text>
                <Text style={styles.tableHeaderText}>Notas</Text>
                {editMode && <Text style={styles.tableHeaderText}>Ações</Text>}
              </View>
              {weapons.map((weapon, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{weapon.name}</Text>
                  <Text style={styles.tableCell}>{weapon.bonusOrDC}</Text>
                  <Text style={styles.tableCell}>{weapon.damageType}</Text>
                  <Text style={styles.tableCell}>{weapon.notes}</Text>
                  {editMode && (
                    <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveWeapon(index)}>
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noItemsText}>Nenhuma arma/ataque cadastrado.</Text>
          )}

          {/* O formulário de adição de ataque foi removido para simplificar a adaptação ao JSON. */}
          {/* Se necessário, pode ser reintroduzido usando a estrutura do JSON. */}
        </View>
      )}

      {activeTab === "magias" && (
        <View style={styles.magiasContent}>
          {spellcasting.hasSpellcasting ? (
            <View>
              <View style={styles.magiasInfo}>
                <View style={styles.magiaStat}>
                  <Text style={styles.magiaStatLabel}>Habilidade de Conjuração</Text>
                  <Text style={styles.magiaStatValue}>{spellcasting.spellcastingAbility || 'N/A'}</Text>
                </View>
                <View style={styles.magiaStat}>
                  <Text style={styles.magiaStatLabel}>CD para Resistir</Text>
                  <Text style={styles.magiaStatValue}>{spellcasting.spellSaveDC || 'N/A'}</Text>
                </View>
                <View style={styles.magiaStat}>
                  <Text style={styles.magiaStatLabel}>Bônus de Ataque</Text>
                  <Text style={styles.magiaStatValue}>{spellcasting.spellAttackBonus || 'N/A'}</Text>
                </View>
              </View>

              {/* Seção de Magias por Nível (Simplificada para exibição) */}
              <Text style={styles.magiasTitle}>Magias Conhecidas/Preparadas</Text>
              {Object.entries(spellcasting.spellsByLevel).map(([level, data]) => (
                data.spells.length > 0 && (
                  <View key={level} style={styles.spellLevelContainer}>
                    <Text style={styles.spellLevelTitle}>Nível {level} ({data.slots.expended}/{data.slots.total} slots)</Text>
                    <Text style={styles.spellList}>{data.spells.map(s => s.name).join(', ')}</Text>
                  </View>
                )
              ))}
              
              {/* Notas de Magia */}
              <Text style={styles.magiasTitle}>Notas de Conjuração</Text>
              <Text style={styles.spellNotes}>{spellcasting.spellNotes || 'Nenhuma nota.'}</Text>

            </View>
          ) : (
            <View style={styles.magiasEmpty}>
              <Text style={styles.noItemsText}>Este personagem não possui habilidades de conjuração.</Text>
              {editMode && <TouchableOpacity style={styles.addMagiaButton} onPress={() => handleSpellcastingChange('hasSpellcasting', true)}><Text style={styles.addMagiaButtonText}>Habilitar Conjuração</Text></TouchableOpacity>}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ataquesTabs: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#3b82f6',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabButtonText: {
    color: '#3b82f6',
  },
  ataquesContent: {
    // Estilos para o conteúdo de ataques
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
	  tableHeaderText: {
	    flex: 1,
	    fontWeight: 'bold',
	    textAlign: 'center',
	    color: '#333',
	  },
	  tableRow: {
	    flexDirection: 'row',
	    paddingVertical: 8,
	    borderBottomWidth: 1,
	    borderBottomColor: '#eee',
	  },
	  tableCell: {
	    flex: 1,
	    textAlign: 'center',
	    color: '#555',
	    paddingHorizontal: 5,
	  },
	  removeButton: {
	    width: 50, // Tamanho fixo para o botão de remover
	    alignItems: 'center',
	    justifyContent: 'center',
	  },
  removeButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
  noItemsText: {
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
    marginTop: 10,
  },
	  // Estilos de formulário de adição removidos, pois a funcionalidade foi simplificada.
	  magiasContent: {
	    // Estilos para o conteúdo de magias
	  },
	  magiasTitle: {
	    fontSize: 16,
	    fontWeight: 'bold',
	    color: '#333',
	    marginTop: 15,
	    marginBottom: 5,
	    borderBottomWidth: 1,
	    borderBottomColor: '#eee',
	    paddingBottom: 5,
	  },
	  spellLevelContainer: {
	    marginBottom: 10,
	    padding: 5,
	    backgroundColor: '#f9f9f9',
	    borderRadius: 5,
	  },
	  spellLevelTitle: {
	    fontWeight: 'bold',
	    color: '#3b82f6',
	    marginBottom: 3,
	  },
	  spellList: {
	    fontSize: 14,
	    color: '#555',
	  },
	  spellNotes: {
	    fontSize: 14,
	    color: '#555',
	    padding: 10,
	    backgroundColor: '#f9f9f9',
	    borderRadius: 5,
	  },
  magiasInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  magiaStat: {
    alignItems: 'center',
  },
  magiaStatLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 5,
  },
  magiaStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  magiasEmpty: {
    alignItems: 'center',
    padding: 20,
  },
  addMagiaButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  addMagiaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AtaquesMagiasSection;

