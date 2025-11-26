import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const AtributosSection = ({ attributes, proficiencyBonus, editMode, onSave }) => {
  const formatMod = (mod) => mod >= 0 ? `+${mod}` : `${mod}`;

  const handleChangeAttribute = (key, value) => {
    const score = parseInt(value) || 0;
    const mod = Math.floor((score - 10) / 2);
    const saveBonus = attributes[key].saveProficient ? mod + proficiencyBonus : mod;

    if (editMode && onSave) {
      onSave({
        ...attributes,
        [key]: { ...attributes[key], score, mod, saveBonus },
      });
    }
  };

  const toggleSaveProficiency = (key) => {
    if (editMode && onSave) {
      const attr = attributes[key];
      const newProf = !attr.saveProficient;
      const newBonus = newProf ? attr.mod + proficiencyBonus : attr.mod;
      onSave({
        ...attributes,
        [key]: { ...attr, saveProficient: newProf, saveBonus: newBonus },
      });
    }
  };

  const attrLabels = {
    str: { nome: "Força", abrev: "FOR" },
    dex: { nome: "Destreza", abrev: "DES" },
    con: { nome: "Constituição", abrev: "CON" },
    int: { nome: "Inteligência", abrev: "INT" },
    wis: { nome: "Sabedoria", abrev: "SAB" },
    cha: { nome: "Carisma", abrev: "CAR" },
  };

  return (
    <View>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>💪</Text>
          <Text style={styles.title}>Atributos</Text>
        </View>

        <View style={styles.profBonus}>
          <Text style={styles.profLabel}>Bônus de Proficiência</Text>
          <Text style={styles.profValue}>{formatMod(proficiencyBonus)}</Text>
        </View>

        <View style={styles.grid}>
          {Object.entries(attributes).map(([key, attr]) => (
            <View key={key} style={styles.attrCard}>
              <Text style={styles.attrAbrev}>{attrLabels[key].abrev}</Text>
              <Text style={styles.attrNome}>{attrLabels[key].nome}</Text>

              {editMode ? (
                <TextInput
                  style={styles.attrInput}
                  keyboardType="numeric"
                  value={String(attr.score)}
                  onChangeText={(text) => handleChangeAttribute(key, text)}
                  maxLength={2}
                />
              ) : (
                <Text style={styles.attrScore}>{attr.score}</Text>
              )}

              <View style={styles.modCircle}>
                <Text style={styles.modValue}>{formatMod(attr.mod)}</Text>
              </View>

              <TouchableOpacity
                style={styles.saveRow}
                onPress={() => toggleSaveProficiency(key)}
                disabled={!editMode}
              >
                <View style={[styles.saveCheck, attr.saveProficient && styles.saveChecked]}>
                  {attr.saveProficient && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.saveText}>
                  Salv. {formatMod(attr.saveBonus)}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  profBonus: {
    backgroundColor: '#0a0e27',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  profValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3b9dff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  attrCard: {
    width: '31%',
    backgroundColor: '#0a0e27',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  attrAbrev: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  attrNome: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 8,
  },
  attrInput: {
    width: 50,
    height: 50,
    backgroundColor: '#1a1f3a',
    borderWidth: 2,
    borderColor: '#3b9dff',
    borderRadius: 25,
    textAlign: 'center',
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '800',
    marginBottom: 8,
  },
  attrScore: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  modCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#3b9dff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  modValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  saveCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#2d3653',
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveChecked: {
    backgroundColor: '#3b9dff',
    borderColor: '#3b9dff',
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  saveText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
  },
});

export default AtributosSection;