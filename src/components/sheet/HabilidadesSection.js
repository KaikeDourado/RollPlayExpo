import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';

/**
 * @function HabilidadesSection
 * @description Componente para exibir e gerenciar habilidades e traços do personagem.
 * Adaptado do projeto React original para React Native.
 * A funcionalidade de adição/remoção é simulada, pois a lógica de backend foi removida.
 * @param {object} features - Objeto contendo as habilidades e traços do personagem (classFeatures, speciesTraits, feats).
 * @param {boolean} editMode - Indica se a seção está em modo de edição.
 * @param {function} onSave - Função para salvar as alterações (simulada).
 */
const HabilidadesSection = ({ features, editMode, onSave }) => {
  const [novaHabilidade, setNovaHabilidade] = useState({ type: 'classFeatures', name: '' });

  const handleAddFeature = () => {
    if (novaHabilidade.name) {
      const updatedFeatures = {
        ...features,
        [novaHabilidade.type]: [...features[novaHabilidade.type], novaHabilidade.name],
      };
      onSave(updatedFeatures);
      Alert.alert('Sucesso', 'Habilidade adicionada (simulada).');
      setNovaHabilidade({ type: 'classFeatures', name: '' });
    } else {
      Alert.alert('Erro', 'O nome da habilidade não pode ser vazio.');
    }
  };

  const handleRemoveFeature = (type, index) => {
    const updatedFeatures = {
      ...features,
      [type]: features[type].filter((_, i) => i !== index),
    };
    onSave(updatedFeatures);
    Alert.alert('Sucesso', 'Habilidade removida (simulada).');
  };

  const handleFeatureChange = (name) => {
    setNovaHabilidade({ ...novaHabilidade, name });
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>✨</Text>
        <Text style={styles.sectionTitle}>Habilidades e Traços</Text>
      </View>

	      <View style={styles.habilidadesList}>
	        {Object.entries(features).map(([type, list]) => (
	          <View key={type} style={styles.featureGroup}>
	            <Text style={styles.featureGroupTitle}>{type === 'classFeatures' ? 'Habilidades de Classe' : type === 'speciesTraits' ? 'Traços de Raça' : 'Talentos'}</Text>
	            {list.length > 0 ? (
	              list.map((feature, index) => (
	                <View key={index} style={styles.habilidadeCard}>
	                  <View style={styles.habilidadeHeader}>
	                    <Text style={styles.habilidadeNome}>{feature}</Text>
	                    {editMode && (
	                      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFeature(type, index)}>
	                        <Text style={styles.removeButtonText}>✕</Text>
	                      </TouchableOpacity>
	                    )}
	                  </View>
	                  {/* O JSON fornecido não tem descrição, apenas o nome. Se houver descrição, ela deve ser adicionada aqui. */}
	                </View>
	              ))
	            ) : (
	              <Text style={styles.noItemsText}>Nenhuma {type === 'classFeatures' ? 'habilidade de classe' : type === 'speciesTraits' ? 'traço de raça' : 'talento'} cadastrada.</Text>
	            )}
	          </View>
	        ))}
	      </View>

	      {editMode && (
	        <View style={styles.addForm}>
	          <Text style={styles.addFormTitle}>Adicionar Habilidade/Traço/Talento</Text>
	          <View style={styles.formGroup}>
	            <Text style={styles.label}>Tipo:</Text>
	            <TextInput
	              style={styles.input}
	              placeholder="Tipo (classFeatures, speciesTraits, feats)"
	              value={novaHabilidade.type}
	              onChangeText={(text) => setNovaHabilidade({ ...novaHabilidade, type: text })}
	            />
	          </View>
	          <View style={styles.formGroup}>
	            <Text style={styles.label}>Nome:</Text>
	            <TextInput
	              style={styles.input}
	              placeholder="Nome da Habilidade"
	              value={novaHabilidade.name}
	              onChangeText={handleFeatureChange}
	            />
	          </View>
	          <TouchableOpacity style={styles.addButton} onPress={handleAddFeature}>
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
	  featureGroup: {
	    marginBottom: 15,
	    padding: 10,
	    backgroundColor: '#f0f8ff',
	    borderRadius: 8,
	  },
	  featureGroupTitle: {
	    fontSize: 18,
	    fontWeight: 'bold',
	    color: '#3b82f6',
	    marginBottom: 10,
	    borderBottomWidth: 1,
	    borderBottomColor: '#b3d9ff',
	    paddingBottom: 5,
	  },
	  habilidadeCard: {
	    backgroundColor: '#fff',
	    borderRadius: 5,
	    padding: 8,
	    marginBottom: 8,
	    borderWidth: 1,
	    borderColor: '#eee',
	  },
	  habilidadeHeader: {
	    flexDirection: 'row',
	    justifyContent: 'space-between',
	    alignItems: 'center',
	  },
	  habilidadeNome: {
	    fontSize: 16,
	    fontWeight: 'bold',
	    color: '#333',
	    flex: 1,
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
	  label: {
	    fontSize: 14,
	    color: '#777',
	    marginBottom: 5,
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

