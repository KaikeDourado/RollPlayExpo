import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

const HabilidadesSection = ({ features, editMode, onSave }) => {
  const [novaHabilidade, setNovaHabilidade] = useState({ type: 'classFeatures', name: '' });

  const handleAddFeature = () => {
    if (novaHabilidade.name) {
      const updatedFeatures = {
        ...features,
        [novaHabilidade.type]: [...features[novaHabilidade.type], novaHabilidade.name],
      };
      onSave(updatedFeatures);
      Alert.alert('Sucesso', 'Habilidade adicionada.');
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
  };

  const featureTypeLabels = {
    classFeatures: { title: 'Habilidades de Classe', icon: '⚔️', color: '#3b9dff' },
    speciesTraits: { title: 'Traços de Raça', icon: '🧬', color: '#10b981' },
    feats: { title: 'Talentos', icon: '⭐', color: '#f59e0b' },
  };

  return (
    <View>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>✨</Text>
          <Text style={styles.title}>Habilidades e Traços</Text>
        </View>

        {Object.entries(features).map(([type, list]) => {
          const typeInfo = featureTypeLabels[type];
          return (
            <View key={type} style={styles.featureGroup}>
              <View style={styles.featureGroupHeader}>
                <Text style={styles.featureGroupIcon}>{typeInfo.icon}</Text>
                <Text style={[styles.featureGroupTitle, { color: typeInfo.color }]}>
                  {typeInfo.title}
                </Text>
              </View>

              {list.length > 0 ? (
                list.map((feature, index) => (
                  <View key={index} style={styles.featureCard}>
                    <View style={styles.featureContent}>
                      <View style={[styles.featureDot, { backgroundColor: typeInfo.color }]} />
                      <Text style={styles.featureName}>{feature}</Text>
                    </View>
                    {editMode && (
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => handleRemoveFeature(type, index)}
                      >
                        <Text style={styles.removeBtnText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  Nenhuma {typeInfo.title.toLowerCase()} cadastrada.
                </Text>
              )}
            </View>
          );
        })}

        {editMode && (
          <View style={styles.addForm}>
            <Text style={styles.addFormTitle}>Adicionar Nova Habilidade</Text>
            
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.typeButtons}>
              {Object.entries(featureTypeLabels).map(([key, info]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.typeButton,
                    novaHabilidade.type === key && styles.typeButtonActive,
                  ]}
                  onPress={() => setNovaHabilidade({ ...novaHabilidade, type: key })}
                >
                  <Text style={styles.typeButtonIcon}>{info.icon}</Text>
                  <Text
                    style={[
                      styles.typeButtonText,
                      novaHabilidade.type === key && styles.typeButtonTextActive,
                    ]}
                  >
                    {info.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Nome da Habilidade</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Ataque Extra"
              placeholderTextColor="#6b7280"
              value={novaHabilidade.name}
              onChangeText={(text) => setNovaHabilidade({ ...novaHabilidade, name: text })}
            />

            <TouchableOpacity style={styles.addBtn} onPress={handleAddFeature}>
              <Text style={styles.addBtnText}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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

  featureGroup: {
    marginBottom: 20,
  },
  featureGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureGroupIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  featureGroupTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0a0e27',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  featureName: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
    flex: 1,
  },
  removeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  removeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 16,
  },

  addForm: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#0a0e27',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  addFormTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeButtons: {
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: '#2d3653',
  },
  typeButtonActive: {
    borderColor: '#3b9dff',
    backgroundColor: '#0a0e27',
  },
  typeButtonIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  typeButtonTextActive: {
    color: '#3b9dff',
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#1a1f3a',
    borderWidth: 1.5,
    borderColor: '#2d3653',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 12,
  },
  addBtn: {
    backgroundColor: '#3b9dff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default HabilidadesSection;