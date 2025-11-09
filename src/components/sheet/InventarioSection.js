
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';

/**
 * @function InventarioSection
 * @description Componente para exibir e gerenciar o inventário do personagem.
 * Adaptado do projeto React original para React Native.
 * A funcionalidade de adição/remoção é simulada, pois a lógica de backend foi removida.
 * @param {object} inventory - Objeto contendo o inventário (equipment, magicItemsAttuned, coins).
 * @param {boolean} editMode - Indica se a seção está em modo de edição.
 * @param {function} onSave - Função para salvar as alterações (simulada).
 */
const InventarioSection = ({ inventory, editMode, onSave }) => {
  const { equipment, magicItemsAttuned, coins } = inventory;
  const [novoItem, setNovoItem] = useState({ name: '', qty: '1', weight: '0', notes: '' });

  const calcularPesoTotal = () => {
    return equipment.reduce((total, item) => total + (parseFloat(item.weight) || 0) * (parseInt(item.qty) || 0), 0);
  };

  const handleAddItem = () => {
    if (novoItem.name) {
      const newItem = {
        name: novoItem.name,
        qty: parseInt(novoItem.qty) || 1,
        weight: parseFloat(novoItem.weight) || 0,
        notes: novoItem.notes,
      };
      const updatedEquipment = [...equipment, newItem];
      Alert.alert('Sucesso', 'Item adicionado (simulado).');
      onSave({ ...inventory, equipment: updatedEquipment });
      setNovoItem({ name: '', qty: '1', weight: '0', notes: '' });
    } else {
      Alert.alert('Erro', 'O nome do item não pode ser vazio.');
    }
  };

  const handleRemoveItem = (index) => {
    const updatedEquipment = equipment.filter((_, i) => i !== index);
    Alert.alert('Sucesso', 'Item removido (simulado).');
    onSave({ ...inventory, equipment: updatedEquipment });
  };

  const handleItemChange = (name, value) => {
    setNovoItem({ ...novoItem, [name]: value });
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (editMode && onSave) {
      const updatedEquipment = [...equipment];
      updatedEquipment[index].qty = parseInt(newQuantity) || 1;
      onSave({ ...inventory, equipment: updatedEquipment });
    }
  };

  const handleCoinChange = (coinType, value) => {
    if (editMode && onSave) {
      const updatedCoins = { ...coins, [coinType]: parseInt(value) || 0 };
      onSave({ ...inventory, coins: updatedCoins });
    }
  };

  const handleToggleAttuned = (index) => {
    if (editMode && onSave) {
      const updatedMagicItems = [...magicItemsAttuned];
      updatedMagicItems[index].attuned = !updatedMagicItems[index].attuned;
      onSave({ ...inventory, magicItemsAttuned: updatedMagicItems });
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
	        {Object.entries(coins).map(([key, value]) => (
	          <View key={key} style={styles.moeda}>
	            <Text style={styles.moedaLabel}>{key.toUpperCase()}: </Text>
	            {editMode ? (
	              <TextInput
	                style={styles.moedaInput}
	                keyboardType="numeric"
	                value={String(value)}
	                onChangeText={(text) => handleCoinChange(key, text)}
	              />
	            ) : (
	              <Text style={styles.moedaValor}>{value}</Text>
	            )}
	          </View>
	        ))}
	      </View>
      </View>

	      <View style={styles.inventarioList}>
	        <Text style={styles.subTitle}>Equipamento</Text>
	        {equipment.length > 0 ? (
	          <View style={styles.table}>
	            <View style={styles.tableHeader}>
	              <Text style={styles.tableHeaderText}>Item</Text>
	              <Text style={styles.tableHeaderText}>Qtd</Text>
	              <Text style={styles.tableHeaderText}>Peso</Text>
	              <Text style={styles.tableHeaderText}>Notas</Text>
	              {editMode && <Text style={styles.tableHeaderText}>Ações</Text>}
	            </View>
	            {equipment.map((item, index) => (
	              <View key={index} style={styles.tableRow}>
	                <Text style={styles.tableCell}>{item.name}</Text>
	                <View style={styles.tableCell}>
	                  {editMode ? (
	                    <TextInput
	                      style={styles.quantidadeInput}
	                      keyboardType="numeric"
	                      value={String(item.qty)}
	                      onChangeText={(text) => handleQuantityChange(index, text)}
	                    />
	                  ) : (
	                    <Text>{item.qty}</Text>
	                  )}
	                </View>
	                <Text style={styles.tableCell}>{item.weight} kg</Text>
	                <Text style={styles.tableCell}>{item.notes}</Text>
	                {editMode && (
	                  <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(index)}>
	                    <Text style={styles.removeButtonText}>✕</Text>
	                  </TouchableOpacity>
	                )}
	              </View>
	            ))}
	          </View>
	        ) : (
	          <Text style={styles.noItemsText}>Nenhum equipamento cadastrado.</Text>
	        )}
	
	        <Text style={styles.subTitle}>Itens Mágicos Sintonizados</Text>
	        {magicItemsAttuned.length > 0 ? (
	          <View style={styles.table}>
	            <View style={styles.tableHeader}>
	              <Text style={styles.tableHeaderText}>Item</Text>
	              <Text style={styles.tableHeaderText}>Sintonizado</Text>
	              {editMode && <Text style={styles.tableHeaderText}>Ações</Text>}
	            </View>
	            {magicItemsAttuned.map((item, index) => (
	              <View key={index} style={styles.tableRow}>
	                <Text style={styles.tableCell}>{item.name}</Text>
	                <TouchableOpacity
	                  style={styles.tableCell}
	                  onPress={() => handleToggleAttuned(index)}
	                  disabled={!editMode}
	                >
	                  <Text style={styles.attunedStatus}>{item.attuned ? 'Sim' : 'Não'}</Text>
	                </TouchableOpacity>
	                {editMode && (
	                  <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(index)}>
	                    <Text style={styles.removeButtonText}>✕</Text>
	                  </TouchableOpacity>
	                )}
	              </View>
	            ))}
	          </View>
	        ) : (
	          <Text style={styles.noItemsText}>Nenhum item mágico sintonizado.</Text>
	        )}
	      </View>

      {editMode && (
        <View style={styles.addForm}>
	          <Text style={styles.addFormTitle}>Adicionar Equipamento</Text>
	          <View style={styles.formRow}>
	            <TextInput
	              style={styles.input}
	              placeholder="Nome do Item"
	              value={novoItem.name}
	              onChangeText={(text) => handleItemChange('name', text)}
	            />
	            <TextInput
	              style={[styles.input, styles.smallInput]}
	              keyboardType="numeric"
	              placeholder="Qtd"
	              value={novoItem.qty}
	              onChangeText={(text) => handleItemChange('qty', text)}
	            />
	            <TextInput
	              style={[styles.input, styles.smallInput]}
	              keyboardType="numeric"
	              placeholder="Peso (kg)"
	              value={novoItem.weight}
	              onChangeText={(text) => handleItemChange('weight', text)}
	            />
	          </View>
	          <TextInput
	            style={styles.input}
	            placeholder="Notas (ex: 'Corda de Cânhamo (15m)')"
	            value={novoItem.notes}
	            onChangeText={(text) => handleItemChange('notes', text)}
	          />
	          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
	            <Text style={styles.addButtonText}>Adicionar Equipamento</Text>
	          </TouchableOpacity>
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
	  moedaInput: {
	    width: 50,
	    height: 25,
	    borderColor: '#ddd',
	    borderWidth: 1,
	    borderRadius: 5,
	    textAlign: 'center',
	    fontSize: 14,
	    backgroundColor: '#f9f9f9',
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
	  subTitle: {
	    fontSize: 16,
	    fontWeight: 'bold',
	    color: '#555',
	    marginTop: 10,
	    marginBottom: 5,
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
	    paddingHorizontal: 5,
	  },
	  attunedStatus: {
	    fontWeight: 'bold',
	    color: '#3b82f6',
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
	    width: 50,
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
	    marginRight: 10,
	  },
	  addButton: {
	    backgroundColor: '#28a745',
	    padding: 10,
	    borderRadius: 5,
	    alignItems: 'center',
	    justifyContent: 'center',
	    marginTop: 10,
	  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default InventarioSection;

