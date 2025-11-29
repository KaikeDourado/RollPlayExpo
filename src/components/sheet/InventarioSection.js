import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

const InventarioSection = ({ inventory, editMode, onSave }) => {
  const { equipment, magicItemsAttuned, coins } = inventory;
  const [novoItem, setNovoItem] = useState({ name: '', qty: '1', weight: '0', notes: '' });

  const calcularPesoTotal = () => {
    return equipment.reduce(
      (total, item) => total + (parseFloat(item.weight) || 0) * (parseInt(item.qty) || 0),
      0
    );
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
      Alert.alert('Sucesso', 'Item adicionado.');
      onSave({ ...inventory, equipment: updatedEquipment });
      setNovoItem({ name: '', qty: '1', weight: '0', notes: '' });
    } else {
      Alert.alert('Erro', 'O nome do item não pode ser vazio.');
    }
  };

  const handleRemoveItem = (index) => {
    Alert.alert(
      'Remover Item',
      'Deseja realmente remover este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            const updatedEquipment = equipment.filter((_, i) => i !== index);
            onSave({ ...inventory, equipment: updatedEquipment });
          }
        }
      ]
    );
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

  const coinIcons = {
    cp: '🟤',
    sp: '⚪',
    ep: '🔵',
    gp: '🟡',
    pp: '⭐',
  };

  return (
    <View>
      {/* Card de Resumo */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>🎒</Text>
          <Text style={styles.title}>Inventário</Text>
        </View>

        {/* Peso Total */}
        <View style={styles.weightContainer}>
          <Text style={styles.weightLabel}>Peso Total</Text>
          <Text style={styles.weightValue}>{calcularPesoTotal().toFixed(1)} kg</Text>
        </View>

        {/* Moedas */}
        <View style={styles.coinsContainer}>
          {Object.entries(coins).map(([key, value]) => (
            <View key={key} style={styles.coinBox}>
              <Text style={styles.coinIcon}>{coinIcons[key]}</Text>
              <Text style={styles.coinType}>{key.toUpperCase()}</Text>
              {editMode ? (
                <TextInput
                  style={styles.coinInput}
                  keyboardType="numeric"
                  value={String(value)}
                  onChangeText={(text) => handleCoinChange(key, text)}
                  placeholderTextColor="#6b7280"
                />
              ) : (
                <Text style={styles.coinValue}>{value}</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Equipamento */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Equipamento</Text>
        {equipment.length > 0 ? (
          equipment.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                {editMode && (
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemoveItem(index)}
                  >
                    <Text style={styles.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.itemDetails}>
                <View style={styles.itemStat}>
                  <Text style={styles.itemStatLabel}>Quantidade</Text>
                  {editMode ? (
                    <TextInput
                      style={styles.qtyInput}
                      keyboardType="numeric"
                      value={String(item.qty)}
                      onChangeText={(text) => handleQuantityChange(index, text)}
                      placeholderTextColor="#6b7280"
                    />
                  ) : (
                    <Text style={styles.itemStatValue}>{item.qty}</Text>
                  )}
                </View>
                <View style={styles.itemStat}>
                  <Text style={styles.itemStatLabel}>Peso Unit.</Text>
                  <Text style={styles.itemStatValue}>{item.weight} kg</Text>
                </View>
                <View style={styles.itemStat}>
                  <Text style={styles.itemStatLabel}>Peso Total</Text>
                  <Text style={styles.itemStatValue}>
                    {(item.weight * item.qty).toFixed(1)} kg
                  </Text>
                </View>
              </View>
              {item.notes && (
                <Text style={styles.itemNotes}>📌 {item.notes}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum equipamento cadastrado.</Text>
        )}

        {editMode && (
          <View style={styles.addForm}>
            <Text style={styles.addFormTitle}>Adicionar Equipamento</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do item"
              placeholderTextColor="#6b7280"
              value={novoItem.name}
              onChangeText={(text) => setNovoItem({ ...novoItem, name: text })}
            />
            <View style={styles.formRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="Qtd"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                value={novoItem.qty}
                onChangeText={(text) => setNovoItem({ ...novoItem, qty: text })}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Peso (kg)"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                value={novoItem.weight}
                onChangeText={(text) => setNovoItem({ ...novoItem, weight: text })}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Notas (opcional)"
              placeholderTextColor="#6b7280"
              value={novoItem.notes}
              onChangeText={(text) => setNovoItem({ ...novoItem, notes: text })}
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddItem}>
              <Text style={styles.addBtnText}>+ Adicionar Item</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Itens Mágicos */}
      {magicItemsAttuned.length > 0 && (
        <View style={[styles.card, {marginBottom: 40}]}>
          <Text style={styles.sectionTitle}>⚡ Itens Mágicos</Text>
          {magicItemsAttuned.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.magicItem}
              onPress={() => handleToggleAttuned(index)}
              disabled={!editMode}
            >
              <View style={[styles.attunedCheck, item.attuned && styles.attunedChecked]}>
                {item.attuned && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.magicItemName}>{item.name}</Text>
              <Text style={styles.attunedLabel}>
                {item.attuned ? 'Sintonizado' : 'Não sintonizado'}
              </Text>
            </TouchableOpacity>
          ))}
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
  
  weightContainer: {
    backgroundColor: '#0a0e27',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weightLabel: { fontSize: 14, fontWeight: '600', color: '#9ca3af' },
  weightValue: { fontSize: 20, fontWeight: '800', color: '#3b9dff' },

  coinsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  coinBox: {
    flex: 1,
    minWidth: 60,
    backgroundColor: '#0a0e27',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  coinIcon: { fontSize: 20, marginBottom: 4 },
  coinType: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 4,
  },
  coinInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#1a1f3a',
    borderWidth: 1,
    borderColor: '#2d3653',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
  },
  coinValue: { fontSize: 16, fontWeight: '800', color: '#3b9dff' },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },

  itemCard: {
    backgroundColor: '#0a0e27',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  removeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  itemDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  itemStat: {
    flex: 1,
    alignItems: 'center',
  },
  itemStatLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  itemStatValue: {
    fontSize: 15,
    color: '#3b9dff',
    fontWeight: '700',
  },
  qtyInput: {
    width: 50,
    height: 28,
    backgroundColor: '#1a1f3a',
    borderWidth: 1,
    borderColor: '#2d3653',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
  },
  itemNotes: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2d3653',
  },

  addForm: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#0a0e27',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  addFormTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1a1f3a',
    borderWidth: 1.5,
    borderColor: '#2d3653',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 8,
  },
  formRow: {
    flexDirection: 'row',
  },
  addBtn: {
    backgroundColor: '#3b9dff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },

  magicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0e27',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3b9dff',
  },
  attunedCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#2d3653',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attunedChecked: {
    backgroundColor: '#3b9dff',
    borderColor: '#3b9dff',
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  magicItemName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  attunedLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },

  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});

export default InventarioSection;