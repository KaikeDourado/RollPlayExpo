
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';

/**
 * @function InventarioSection
 * @description Componente para exibir e gerenciar o inventário do personagem.
 * Adaptado do projeto React original para React Native.
 * A funcionalidade de adição/remoção é simulada, pois a lógica de backend foi removida.
 * @param {Array} inventario - Lista de itens no inventário do personagem.
 * @param {boolean} editMode - Indica se a seção está em modo de edição.
 * @param {function} onSave - Função para salvar as alterações (simulada).
 */
const InventarioSection = ({ inventario, editMode, onSave }) => {
  const [novoItem, setNovoItem] = useState({ nome: '', quantidade: '1', peso: '0' });

  const calcularPesoTotal = () => {
    return inventario.reduce((total, item) => total + (parseFloat(item.peso) || 0) * (parseInt(item.quantidade) || 0), 0);
  };

  const handleAddItem = () => {
    if (novoItem.nome) {
      const updatedInventario = [
        ...inventario,
        {
          ...novoItem,
          quantidade: parseInt(novoItem.quantidade) || 1,
          peso: parseFloat(novoItem.peso) || 0,
        },
      ];
      // Em um cenário real, você chamaria uma API para salvar
      Alert.alert('Sucesso', 'Item adicionado (simulado).');
      onSave(updatedInventario);
      setNovoItem({ nome: '', quantidade: '1', peso: '0' });
    } else {
      Alert.alert('Erro', 'O nome do item não pode ser vazio.');
    }
  };

  const handleRemoveItem = (index) => {
    const updatedInventario = inventario.filter((_, i) => i !== index);
    // Em um cenário real, você faria uma chamada de API para remover
    Alert.alert('Sucesso', 'Item removido (simulado).');
    onSave(updatedInventario);
  };

  const handleItemChange = (name, value) => {
    setNovoItem({ ...novoItem, [name]: value });
  };

  const handleQuantidadeChange = (index, newQuantidade) => {
    if (editMode && onSave) {
      const updatedInventario = [...inventario];
      updatedInventario[index].quantidade = parseInt(newQuantidade) || 1;
      onSave(updatedInventario);
    }
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>🎒</Text>
        <Text style={styles.sectionTitle}>Inventário</Text>
      </View>

      <View style={styles.inventarioSummary}>
        <View style={styles.pesoTotal}>
          <Text>Peso Total: </Text>
          <Text style={styles.pesoValor}>{calcularPesoTotal().toFixed(1)} kg</Text>
        </View>
        <View style={styles.moedas}>
          <View style={styles.moeda}>
            <Text style={styles.moedaIcon}>🥇</Text>
            <Text style={styles.moedaLabel}>PO: </Text>
            <Text style={styles.moedaValor}>75</Text>
          </View>
          <View style={styles.moeda}>
            <Text style={styles.moedaIcon}>🥈</Text>
            <Text style={styles.moedaLabel}>PP: </Text>
            <Text style={styles.moedaValor}>32</Text>
          </View>
          <View style={styles.moeda}>
            <Text style={styles.moedaIcon}>🥉</Text>
            <Text style={styles.moedaLabel}>PC: </Text>
            <Text style={styles.moedaValor}>15</Text>
          </View>
        </View>
      </View>

      <View style={styles.inventarioList}>
        {inventario.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Item</Text>
              <Text style={styles.tableHeaderText}>Qtd</Text>
              <Text style={styles.tableHeaderText}>Peso</Text>
              {editMode && <Text style={styles.tableHeaderText}>Ações</Text>}
            </View>
            {inventario.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.nome}</Text>
                <View style={styles.tableCell}>
                  {editMode ? (
                    <TextInput
                      style={styles.quantidadeInput}
                      keyboardType="numeric"
                      value={String(item.quantidade)}
                      onChangeText={(text) => handleQuantidadeChange(index, text)}
                    />
                  ) : (
                    <Text>{item.quantidade}</Text>
                  )}
                </View>
                <Text style={styles.tableCell}>{item.peso} kg</Text>
                {editMode && (
                  <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(index)}>
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noItemsText}>Nenhum item no inventário.</Text>
        )}
      </View>

      {editMode && (
        <View style={styles.addForm}>
          <Text style={styles.addFormTitle}>Adicionar Item</Text>
          <View style={styles.formRow}>
            <TextInput
              style={styles.input}
              placeholder="Nome do Item"
              value={novoItem.nome}
              onChangeText={(text) => handleItemChange('nome', text)}
            />
            <TextInput
              style={[styles.input, styles.smallInput]}
              keyboardType="numeric"
              placeholder="Qtd"
              value={novoItem.quantidade}
              onChangeText={(text) => handleItemChange('quantidade', text)}
            />
            <TextInput
              style={[styles.input, styles.smallInput]}
              keyboardType="numeric"
              placeholder="Peso (kg)"
              value={novoItem.peso}
              onChangeText={(text) => handleItemChange('peso', text)}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
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
  inventarioSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pesoTotal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pesoValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginLeft: 5,
  },
  moedas: {
    flexDirection: 'row',
  },
  moeda: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  moedaIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  moedaLabel: {
    fontSize: 14,
    color: '#777',
  },
  moedaValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  inventarioList: {
    // Estilos para a lista de inventário
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
    justifyContent: 'center',
  },
  quantidadeInput: {
    height: 30,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#f9f9f9',
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
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 14,
    marginRight: 10,
  },
  smallInput: {
    flex: 0.5,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default InventarioSection;

