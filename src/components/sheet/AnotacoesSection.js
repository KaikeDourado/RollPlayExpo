import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

const AnotacoesSection = ({ notes, editMode, onSave }) => {
  const handleChange = (text) => {
    if (editMode && onSave) {
      onSave(text);
    }
  };

  return (
    <View style={[styles.card, { marginBottom: 40 }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>📝</Text>
        <Text style={styles.cardTitle}>Anotações</Text>
      </View>

      <View style={styles.anotacoesContent}>
        {editMode ? (
          <TextInput
            style={styles.anotacoesTextarea}
            value={notes || ''}
            onChangeText={handleChange}
            placeholder="Adicione anotações sobre seu personagem aqui..."
            placeholderTextColor="#6b7280"
            multiline
            textAlignVertical="top"
          />
        ) : (
          <Text style={styles.anotacoesText}>
            {notes || 'Nenhuma anotação.'}
          </Text>
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3653',
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  anotacoesContent: {
    // Container para o conteúdo das anotações
  },
  anotacoesTextarea: {
    backgroundColor: '#0a0e27',
    borderWidth: 1.5,
    borderColor: '#2d3653',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
    minHeight: 150,
    lineHeight: 22,
  },
  anotacoesText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
    lineHeight: 22,
    paddingVertical: 8,
  },
});

export default AnotacoesSection;