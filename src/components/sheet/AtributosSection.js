import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

/**
 * @function AtributosSection
 * @description Componente para exibir e editar atributos e perícias do personagem.
 * Adaptado do projeto React original para React Native.
 * A funcionalidade de edição e salvamento é simulada, pois a lógica de backend foi removida.
 * @param {object} attributes - Objeto contendo os dados completos dos atributos (str, dex, con, int, wis, cha).
 * @param {object} skills - Objeto contendo os dados completos das perícias. (REMOVIDO, pois a lógica de perícias será movida para PericiasProficienciasSection)
 * @param {number} proficiencyBonus - Bônus de proficiência do personagem.
 * @param {boolean} editMode - Indica se a seção está em modo de edição.
 * @param {function} onSave - Função para salvar os atributos (simulada).
 * @param {function} onSavePericias - Função para salvar as perícias (REMOVIDO).
 */
const AtributosSection = ({ attributes, proficiencyBonus, editMode, onSave }) => {
  const formatModificador = (mod) => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const handleChangeAttribute = (key, value) => {
    const score = Number.parseInt(value) || 0;
    const mod = Math.floor((score - 10) / 2);
    const saveBonus = attributes[key].saveProficient ? mod + proficiencyBonus : mod;

    if (editMode && onSave) {
      const updatedAttributes = {
        ...attributes,
        [key]: {
          ...attributes[key],
          score: score,
          mod: mod,
          saveBonus: saveBonus,
        },
      };
      onSave(updatedAttributes);
    }
  };

  const atributosLabels = {
    str: { nome: "Força", abrev: "FOR" },
    dex: { nome: "Destreza", abrev: "DES" },
    con: { nome: "Constituição", abrev: "CON" },
    int: { nome: "Inteligência", abrev: "INT" },
    wis: { nome: "Sabedoria", abrev: "SAB" },
    cha: { nome: "Carisma", abrev: "CAR" },
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>💪</Text>
        <Text style={styles.sectionTitle}>Atributos</Text>
      </View>

      <View style={styles.atributosGrid}>
        {Object.entries(attributes).map(([key, attr]) => (
          <View key={key} style={styles.atributoCard}>
            <Text style={styles.atributoHeader}>{atributosLabels[key].abrev}</Text>
            <Text style={styles.atributoNome}>{atributosLabels[key].nome}</Text>

            <View style={styles.atributoValor}>
              {editMode ? (
                <TextInput
                  style={styles.inputAtributo}
                  keyboardType="numeric"
                  value={String(attr.score)}
                  onChangeText={(text) => handleChangeAttribute(key, text)}
                  maxLength={2} // Limitar a 2 dígitos para atributos
                />
              ) : (
                <Text style={styles.atributoValorText}>{attr.score}</Text>
              )}
            </View>

            <Text style={styles.atributoModificador}>{formatModificador(attr.mod)}</Text>
            
            {/* Bônus de Salvamento */}
            <TouchableOpacity
              style={styles.saveBonusContainer}
              onPress={() => {
                if (editMode && onSave) {
                  const newSaveProficient = !attr.saveProficient;
                  const newSaveBonus = newSaveProficient ? attr.mod + proficiencyBonus : attr.mod;
                  const updatedAttributes = {
                    ...attributes,
                    [key]: {
                      ...attr,
                      saveProficient: newSaveProficient,
                      saveBonus: newSaveBonus,
                    },
                  };
                  onSave(updatedAttributes);
                }
              }}
              disabled={!editMode}
            >
              <Text style={styles.saveBonusProficient}>{attr.saveProficient ? "●" : "○"}</Text>
              <Text style={styles.saveBonusText}>Salvamento: {formatModificador(attr.saveBonus)}</Text>
            </TouchableOpacity>
          </View>
        ))}
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
  atributosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  atributoCard: {
    width: '30%', // Ajuste para 3 colunas em telas menores
    alignItems: 'center',
    marginVertical: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
  },
  atributoHeader: {
    fontSize: 12,
    color: '#777',
  },
  atributoNome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  atributoValor: {
    marginBottom: 5,
  },
  inputAtributo: {
    width: 40,
    height: 30,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  atributoValorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  atributoModificador: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  saveBonusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginTop: 5,
  },
  saveBonusProficient: {
    fontSize: 16,
    marginRight: 5,
    color: '#3b82f6',
  },
  saveBonusText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
  bonusProficiencia: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
  },
  bonusValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginLeft: 5,
  },
  periciasList: {
    marginBottom: 20,
  },
  periciaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  periciaProficiente: {
    fontSize: 16,
    marginRight: 10,
    color: '#3b82f6',
  },
  periciaBonus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    width: 40,
    textAlign: 'center',
  },
  periciaNome: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  periciaAtributo: {
    fontSize: 14,
    color: '#777',
  },
  outrasProficiencias: {
    marginTop: 10,
  },
  outrasProficienciasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  proficienciasContent: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  proficienciasTextarea: {
    minHeight: 120,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  proficienciasText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 5,
  },
  proficienciasTextBold: {
    fontWeight: 'bold',
  },
});

export default AtributosSection;

