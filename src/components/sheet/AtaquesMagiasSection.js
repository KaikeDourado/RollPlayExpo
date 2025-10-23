
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';

/**
 * @function AtaquesMagiasSection
 * @description Componente para exibir e gerenciar ataques e magias do personagem.
 * Adaptado do projeto React original para React Native.
 * A funcionalidade de adição/remoção é simulada, pois a lógica de backend foi removida.
 * @param {Array} ataques - Lista de ataques do personagem.
 * @param {Array} magias - Lista de magias do personagem (não implementado neste exemplo).
 * @param {boolean} editMode - Indica se a seção está em modo de edição.
 * @param {function} onSave - Função para salvar as alterações (simulada).
 */
const AtaquesMagiasSection = ({ ataques, magias, editMode, onSave }) => {
  const [activeTab, setActiveTab] = useState("ataques");
  const [novoAtaque, setNovoAtaque] = useState({ nome: "", bonus: "", dano: "", tipo: "" });

  const handleAddAtaque = () => {
    if (novoAtaque.nome && novoAtaque.bonus && novoAtaque.dano && novoAtaque.tipo) {
      const updatedAtaques = [...ataques, novoAtaque];
      // Em um cenário real, você chamaria uma API para salvar
      Alert.alert("Sucesso", "Ataque adicionado (simulado).");
      setNovoAtaque({ nome: "", bonus: "", dano: "", tipo: "" });
    } else {
      Alert.alert("Erro", "Preencha todos os campos para adicionar um ataque.");
    }
  };

  const handleRemoveAtaque = (index) => {
    // Em um cenário real, você faria uma chamada de API para remover
    Alert.alert("Sucesso", "Ataque removido (simulado).");
  };

  const handleAtaqueChange = (name, value) => {
    setNovoAtaque({ ...novoAtaque, [name]: value });
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
          {ataques.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Nome</Text>
                <Text style={styles.tableHeaderText}>Bônus</Text>
                <Text style={styles.tableHeaderText}>Dano/Tipo</Text>
                {editMode && <Text style={styles.tableHeaderText}>Ações</Text>}
              </View>
              {ataques.map((ataque, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{ataque.nome}</Text>
                  <Text style={styles.tableCell}>{ataque.bonus}</Text>
                  <Text style={styles.tableCell}>{`${ataque.dano} ${ataque.tipo}`}</Text>
                  {editMode && (
                    <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveAtaque(index)}>
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noItemsText}>Nenhum ataque cadastrado.</Text>
          )}

          {editMode && (
            <View style={styles.addForm}>
              <Text style={styles.addFormTitle}>Adicionar Ataque</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={novoAtaque.nome}
                onChangeText={(text) => handleAtaqueChange("nome", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Bônus (ex: +5)"
                value={novoAtaque.bonus}
                onChangeText={(text) => handleAtaqueChange("bonus", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Dano (ex: 1d8+3)"
                value={novoAtaque.dano}
                onChangeText={(text) => handleAtaqueChange("dano", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Tipo (ex: Cortante)"
                value={novoAtaque.tipo}
                onChangeText={(text) => handleAtaqueChange("tipo", text)}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddAtaque}>
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {activeTab === "magias" && (
        <View style={styles.magiasContent}>
          <View style={styles.magiasInfo}>
            <View style={styles.magiaStat}>
              <Text style={styles.magiaStatLabel}>Habilidade de Conjuração</Text>
              <Text style={styles.magiaStatValue}>-</Text>
            </View>
            <View style={styles.magiaStat}>
              <Text style={styles.magiaStatLabel}>CD para Resistir</Text>
              <Text style={styles.magiaStatValue}>-</Text>
            </View>
            <View style={styles.magiaStat}>
              <Text style={styles.magiaStatLabel}>Bônus de Ataque</Text>
              <Text style={styles.magiaStatValue}>-</Text>
            </View>
          </View>

          <View style={styles.magiasEmpty}>
            <Text style={styles.noItemsText}>Este personagem não possui magias.</Text>
            {editMode && <TouchableOpacity style={styles.addMagiaButton} onPress={() => Alert.alert("Funcionalidade", "Adicionar Magias será implementado com a integração de backend.")}><Text style={styles.addMagiaButtonText}>Adicionar Magias</Text></TouchableOpacity>}
          </View>
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
  },
  removeButton: {
    flex: 1,
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
  addForm: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addFormTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  magiasContent: {
    // Estilos para o conteúdo de magias
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

