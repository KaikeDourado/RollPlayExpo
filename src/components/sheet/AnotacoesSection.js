
import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

/**
 * @function AnotacoesSection
 * @description Componente para exibir e editar anotações do personagem.
 * Adaptado do projeto React original para React Native.
 * A funcionalidade de edição e salvamento é simulada, pois a lógica de backend foi removida.
 * @param {string} anotacoes - O texto das anotações.
 * @param {boolean} editMode - Indica se a seção está em modo de edição.
 * @param {function} onSave - Função para salvar as anotações (simulada).
 */
const AnotacoesSection = ({ anotacoes, editMode, onSave }) => {
  // A função handleChange e onSave são mantidas como placeholders para futura integração de backend
  const handleChange = (text) => {
    if (editMode && onSave) {
      onSave(text);
    }
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>📝</Text>
        <Text style={styles.sectionTitle}>Anotações</Text>
      </View>

      <View style={styles.anotacoesContent}>
        {editMode ? (
          <TextInput
            style={styles.anotacoesTextarea}
            value={anotacoes}
            onChangeText={handleChange}
            placeholder="Adicione anotações sobre seu personagem aqui..."
            multiline
            textAlignVertical="top"
          />
        ) : (
          <Text style={styles.anotacoesText}>{anotacoes || 'Nenhuma anotação.'}</Text>
        )}
      </View>
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
  anotacoesContent: {
    // Estilos para o conteúdo das anotações
  },
  anotacoesTextarea: {
    minHeight: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  anotacoesText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});

export default AnotacoesSection;

