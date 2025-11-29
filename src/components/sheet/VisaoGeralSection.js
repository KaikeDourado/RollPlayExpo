import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const VisaoGeralSection = ({ data, editMode, onSave }) => {
  const handleChange = (field, value) => {
    if (editMode && onSave) {
      const updatedData = { ...data, [field]: value };
      onSave(updatedData);
    }
  };

  const toggleInspiracao = () => {
    if (onSave) {
      const updatedData = { ...data, inspirationHeroica: !data.inspirationHeroica };
      onSave(updatedData);
    }
  };

  const renderField = (label, field, isNumeric = false) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editMode ? (
        <TextInput
          style={styles.fieldInput}
          value={String(data[field] || '')}
          onChangeText={(text) => handleChange(field, isNumeric ? parseInt(text) || 0 : text)}
          keyboardType={isNumeric ? 'numeric' : 'default'}
          placeholderTextColor="#6b7280"
        />
      ) : (
        <Text style={styles.fieldValue}>{data[field] || '-'}</Text>
      )}
    </View>
  );

  return (
    <View>
      {/* Card Principal */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>📋</Text>
          <Text style={styles.cardTitle}>Informações Básicas</Text>
        </View>

        <View style={styles.grid}>
          {renderField('Nome', 'name')}
          {renderField('Raça', 'race')}
          {renderField('Classe', 'characterClass')}
          {renderField('Nível', 'level', true)}
          {renderField('Alinhamento', 'alignment')}
          {renderField('Antecedente', 'background')}
        </View>

        {/* Experiência */}
        <View style={styles.xpContainer}>
          <Text style={styles.xpLabel}>Pontos de Experiência</Text>
          {editMode ? (
            <TextInput
              style={styles.xpInput}
              value={String(data.xp || 0)}
              onChangeText={(text) => handleChange('xp', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholderTextColor="#6b7280"
            />
          ) : (
            <Text style={styles.xpValue}>{data.xp || 0} XP</Text>
          )}
        </View>

        {/* Inspiração */}
        <TouchableOpacity
          style={styles.inspiracaoContainer}
          onPress={toggleInspiracao}
          disabled={!editMode}
        >
          <View style={styles.inspiracaoContent}>
            <Text style={styles.inspiracaoLabel}>Inspiração Heroica</Text>
            <View style={[
              styles.inspiracaoToggle,
              data.inspirationHeroica && styles.inspiracaoActive
            ]}>
              {data.inspirationHeroica && <Text style={styles.inspiracaoCheck}>✓</Text>}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🛡️</Text>
          <Text style={styles.statValue}>{data.ac?.value || 10}</Text>
          <Text style={styles.statLabel}>Classe de Armadura</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⚡</Text>
          <Text style={styles.statValue}>
            {data.initiative >= 0 ? '+' : ''}{data.initiative || 0}
          </Text>
          <Text style={styles.statLabel}>Iniciativa</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>👟</Text>
          <Text style={styles.statValue}>{data.speed?.walk || 9}m</Text>
          <Text style={styles.statLabel}>Deslocamento</Text>
        </View>
      </View>

      {/* Informações Adicionais */}
      <View style={[styles.card, {marginBottom: 40}]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>ℹ️</Text>
          <Text style={styles.cardTitle}>Outras Informações</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tamanho:</Text>
          <Text style={styles.infoValue}>{data.size || 'Médio'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Percepção Passiva:</Text>
          <Text style={styles.infoValue}>{data.passivePerception || 10}</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  fieldGroup: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldInput: {
    backgroundColor: '#0a0e27',
    borderWidth: 1.5,
    borderColor: '#2d3653',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    paddingVertical: 10,
  },
  xpContainer: {
    backgroundColor: '#0a0e27',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  xpInput: {
    backgroundColor: '#1a1f3a',
    borderWidth: 1.5,
    borderColor: '#2d3653',
    borderRadius: 6,
    padding: 8,
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'center',
  },
  xpValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b9dff',
  },
  inspiracaoContainer: {
    backgroundColor: '#0a0e27',
    borderRadius: 8,
    padding: 12,
  },
  inspiracaoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inspiracaoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  inspiracaoToggle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#2d3653',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1f3a',
  },
  inspiracaoActive: {
    backgroundColor: '#3b9dff',
    borderColor: '#3b9dff',
  },
  inspiracaoCheck: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#3b9dff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3653',
  },
  infoLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default VisaoGeralSection;