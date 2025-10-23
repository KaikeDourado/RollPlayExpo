import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

/**
 * @function PersonalidadeSection
 * @description Componente para exibir e editar traços de personalidade, ideais, ligações, defeitos e história do personagem.
 * Adaptado do projeto React original para React Native.
 * A funcionalidade de edição e salvamento é simulada, pois a lógica de backend foi removida.
 * @param {object} personalidade - Objeto contendo os dados de personalidade do personagem.
 * @param {boolean} editMode - Indica se a seção está em modo de edição.
 * @param {function} onSave - Função para salvar as alterações (simulada).
 */
const PersonalidadeSection = ({ personalidade, editMode, onSave }) => {
  const handleChange = (field, value) => {
    if (editMode && onSave) {
      onSave({ ...personalidade, [field]: value });
    }
  };

  const renderEditableText = (field, placeholder) => (
    editMode ? (
      <TextInput
        style={styles.personalidadeTextarea}
        value={personalidade[field] || ''}
        onChangeText={(text) => handleChange(field, text)}
        placeholder={placeholder}
        multiline
        textAlignVertical="top"
      />
    ) : (
      <Text style={styles.personalidadeText}>{personalidade[field] || `Nenhum ${placeholder.toLowerCase().replace('adicione os ', '').replace(' do seu personagem...', '')}.`}</Text>
    )
  );

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>🎭</Text>
        <Text style={styles.sectionTitle}>Traços & Origem</Text>
      </View>

      <View style={styles.personalidadeContent}>
        {/* Bloco: Traços de Personalidade */}
        <View style={styles.personalidadeBlock}>
          <Text style={styles.personalidadeBlockTitle}>Traços de Personalidade</Text>
          {renderEditableText('tracos', 'Adicione os traços de personalidade do seu personagem...')}
        </View>

        {/* Bloco: Ideais */}
        <View style={styles.personalidadeBlock}>
          <Text style={styles.personalidadeBlockTitle}>Ideais</Text>
          {renderEditableText('ideais', 'Adicione os ideais do seu personagem...')}
        </View>

        {/* Bloco: Ligações */}
        <View style={styles.personalidadeBlock}>
          <Text style={styles.personalidadeBlockTitle}>Ligações</Text>
          {renderEditableText('ligacoes', 'Adicione as ligações do seu personagem...')}
        </View>

        {/* Bloco: Defeitos */}
        <View style={styles.personalidadeBlock}>
          <Text style={styles.personalidadeBlockTitle}>Defeitos</Text>
          {renderEditableText('defeitos', 'Adicione os defeitos do seu personagem...')}
        </View>
      </View>

      {/* Bloco: História */}
      <View style={[styles.personalidadeBlock, styles.historiaBlock]}>
        <Text style={styles.personalidadeBlockTitle}>História</Text>
        {renderEditableText('historia', 'Adicione a história do seu personagem...')}
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
  personalidadeContent: {
    // Estilos para o conteúdo principal da seção de personalidade
  },
  personalidadeBlock: {
    marginBottom: 15,
  },
  personalidadeBlockTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  personalidadeTextarea: {
    minHeight: 80,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  personalidadeText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  historiaBlock: {
    marginTop: 20,
  },
});

export default PersonalidadeSection;

