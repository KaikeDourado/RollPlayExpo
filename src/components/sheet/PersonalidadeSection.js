import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

const PersonalidadeSection = ({ data, editMode, onSave }) => {
  const handleChange = (field, value) => {
    if (editMode && onSave) {
      onSave({ ...data, [field]: value });
    }
  };

  const renderEditableText = (field, placeholder) => (
    editMode ? (
      <TextInput
        style={styles.personalidadeTextarea}
        value={data[field] || ''}
        onChangeText={(text) => handleChange(field, text)}
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        multiline
        textAlignVertical="top"
      />
    ) : (
      <Text style={styles.personalidadeText}>
        {data[field] || `Nenhum ${placeholder.toLowerCase().replace('adicione a ', '').replace('adicione os ', '').replace('adicione as ', '').replace(' do seu personagem...', '')}.`}
      </Text>
    )
  );

  return (
    <View>
      {/* Card Principal - Traços & Origem */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>🎭</Text>
          <Text style={styles.cardTitle}>Traços & Origem</Text>
        </View>

        <View style={styles.personalidadeContent}>
          {/* Bloco: Aparência */}
          <View style={styles.personalidadeBlock}>
            <Text style={styles.personalidadeBlockTitle}>Aparência</Text>
            {renderEditableText('appearance', 'Adicione a aparência do seu personagem...')}
          </View>

          {/* Bloco: Ideais */}
          <View style={styles.personalidadeBlock}>
            <Text style={styles.personalidadeBlockTitle}>Ideais</Text>
            {renderEditableText('ideals', 'Adicione os ideais do seu personagem...')}
          </View>

          {/* Bloco: Ligações */}
          <View style={styles.personalidadeBlock}>
            <Text style={styles.personalidadeBlockTitle}>Ligações</Text>
            {renderEditableText('bonds', 'Adicione as ligações do seu personagem...')}
          </View>

          {/* Bloco: Defeitos */}
          <View style={styles.personalidadeBlock}>
            <Text style={styles.personalidadeBlockTitle}>Defeitos</Text>
            {renderEditableText('flaws', 'Adicione os defeitos do seu personagem...')}
          </View>
        </View>
      </View>

      {/* Card História e Personalidade */}
      <View style={[styles.card, { marginBottom: 40 }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>📖</Text>
          <Text style={styles.cardTitle}>História e Personalidade</Text>
        </View>

        <View style={styles.historiaBlock}>
          {renderEditableText('backstoryPersonality', 'Adicione a história e traços de personalidade do seu personagem...')}
        </View>
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
  personalidadeContent: {
    gap: 16,
  },
  personalidadeBlock: {
    marginBottom: 16,
  },
  personalidadeBlockTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  personalidadeTextarea: {
    backgroundColor: '#0a0e27',
    borderWidth: 1.5,
    borderColor: '#2d3653',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
    minHeight: 100,
    lineHeight: 22,
  },
  personalidadeText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
    lineHeight: 22,
    paddingVertical: 8,
  },
  historiaBlock: {
    // Estilos já aplicados pelo bloco pai
  },
});

export default PersonalidadeSection;