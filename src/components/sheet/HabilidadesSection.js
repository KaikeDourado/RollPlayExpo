import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';

/**
 * @function HabilidadesSection
 * @description Componente para exibir e gerenciar habilidades e traços do personagem.
 * Adaptado do projeto React original para React Native.
 * A funcionalidade de adição/remoção é simulada, pois a lógica de backend foi removida.
 * @param {Array} habilidades - Lista de habilidades do personagem.
 * @param {boolean} editMode - Indica se a seção está em modo de edição.
 * @param {function} onSave - Função para salvar as alterações (simulada).
 */
const HabilidadesSection = ({ habilidades, editMode, onSave }) => {
  const [novaHabilidade, setNovaHabilidade] = useState({ nome: '', descricao: '' });

  const handleAddHabilidade = () => {
    if (novaHabilidade.nome && novaHabilidade.descricao) {
      // Em um cenário real, você chamaria uma API para salvar
      Alert.alert('Sucesso', 'Habilidade adicionada (simulada).');
      setNovaHabilidade({ nome: '', descricao: '' });
    } else {
      Alert.alert('Erro', 'Preencha todos os campos para adicionar uma habilidade.');
    }
  };

  const handleRemoveHabilidade = (index) => {
    // Em um cenário real, você faria uma chamada de API para remover
    Alert.alert('Sucesso', 'Habilidade removida (simulada).');
  };

  const handleHabilidadeChange = (name, value) => {
    setNovaHabilidade({ ...novaHabilidade, [name]: value });
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>✨</Text>
        <Text style={styles.sectionTitle}>Habilidades e Traços</Text>
      </View>

      <View style={styles.habilidadesList}>
        {habilidades.length > 0 ? (
          habilidades.map((habilidade, index) => (
            <View key={index} style={styles.habilidadeCard}>
              <View style={styles.habilidadeHeader}>
                <Text style={styles.habilidadeNome}>{habilidade.nome}</Text>
                {editMode && (
                  <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveHabilidade(index)}>
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.habilidadeDescricao}>{habilidade.descricao}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noItemsText}>Nenhuma habilidade cadastrada.</Text>
        )}
      </View>

      {editMode && (
        <View style={styles.addForm}>
          <Text style={styles.addFormTitle}>Adicionar Habilidade</Text>
          <View style={styles.formGroup}>
            <TextInput
              style={styles.input}
              placeholder="Nome da Habilidade"
              value={novaHabilidade.nome}
              onChangeText={(text) => handleHabilidadeChange('nome', text)}
            />
          </View>
          <View style={styles.formGroup}>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Descrição da Habilidade"
              value={novaHabilidade.descricao}
              onChangeText={(text) => handleHabilidadeChange('descricao', text)}
              multiline
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddHabilidade}>
            <Text style={styles.addButtonText}>Adicionar</Text>
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
  habilidadesList: {
    // Estilos para a lista de habilidades
  },
  habilidadeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  habilidadeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  habilidadeNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  habilidadeDescricao: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
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
  formGroup: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textarea: {
    minHeight: 80,
    paddingTop: 10,
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
});

export default HabilidadesSection;

