import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * @function PericiasProficienciasSection
 * @description Componente para exibir e editar perícias, proficiências e idiomas do personagem.
 * @param {object} skills - Objeto contendo os dados completos das perícias.
 * @param {number} proficiencyBonus - Bônus de proficiência do personagem.
 * @param {object} equipmentProficiencies - Objeto contendo proficiências em equipamentos. (Não usado diretamente, mas mantido para documentação)
 * @param {array} languages - Array de idiomas.
 * @param {object} treinamentoEProfEquip - Objeto com proficiências de equipamento formatadas (para exibição).
 * @param {boolean} editMode - Indica se a seção está em modo de edição.
 * @param {function} onSave - Função para salvar as alterações nas perícias (simulada).
 */
const PericiasProficienciasSection = ({
  skills,
  proficiencyBonus,
  equipmentProficiencies,
  languages,
  treinamentoEProfEquip,
  editMode,
  onSave,
}) => {
  const formatModificador = (mod) => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const skillLabels = {
    athletics: "Atletismo",
    acrobatics: "Acrobacia",
    sleightOfHand: "Prestidigitação",
    stealth: "Furtividade",
    arcana: "Arcanismo",
    history: "História",
    investigation: "Investigação",
    nature: "Natureza",
    religion: "Religião",
    animalHandling: "Lidar com Animais",
    insight: "Intuição",
    medicine: "Medicina",
    perception: "Percepção",
    survival: "Sobrevivência",
    deception: "Enganação",
    intimidation: "Intimidação",
    performance: "Atuação",
    persuasion: "Persuasão",
  };

  const handleToggleProficiency = (skillKey) => {
    if (editMode && onSave) {
      const skill = skills[skillKey];
      const newProficient = !skill.proficient;
      
      // Recalcula o bônus da perícia.
      // O bônus no JSON é o valor final. Para recalcular, precisamos do mod do atributo.
      // Assumindo que o `skill.bonus` é o valor atual, e o `skill.proficient` é o estado atual.
      // O mod do atributo é: skill.bonus - (skill.proficient ? proficiencyBonus : 0)
      const attributeMod = skill.bonus - (skill.proficient ? proficiencyBonus : 0);
      const newBonus = newProficient ? attributeMod + proficiencyBonus : attributeMod;

      const updatedSkills = {
        ...skills,
        [skillKey]: {
          ...skill,
          proficient: newProficient,
          bonus: newBonus,
        },
      };
      onSave(updatedSkills);
    }
  };

  // Mapeamento de atributos para exibição
  const attributeMap = {
    str: 'FOR',
    dex: 'DES',
    con: 'CON',
    int: 'INT',
    wis: 'SAB',
    cha: 'CAR',
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>🎯</Text>
        <Text style={styles.sectionTitle}>Perícias e Proficiências</Text>
      </View>

      <View style={styles.bonusProficiencia}>
        <Text>Bônus de Proficiência: </Text>
        <Text style={styles.bonusValor}>{formatModificador(proficiencyBonus)}</Text>
      </View>

      <View style={styles.periciasList}>
        {Object.entries(skills).map(([key, skill]) => (
          <TouchableOpacity
            key={key}
            style={styles.periciaItem}
            onPress={() => handleToggleProficiency(key)}
            disabled={!editMode}
          >
            <Text style={styles.periciaProficiente}>{skill.proficient ? "●" : "○"}</Text>
            <Text style={styles.periciaBonus}>{formatModificador(skill.bonus)}</Text>
            <Text style={styles.periciaNome}>{skillLabels[key]}</Text>
            <Text style={styles.periciaAtributo}>
              ({attributeMap[skill.ability]})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.outrasProficiencias}>
        <Text style={styles.outrasProficienciasTitle}>Outras Proficiências e Idiomas</Text>
        <View style={styles.proficienciasContent}>
          {/* Exibição de Proficiências de Equipamento */}
          <Text style={styles.proficienciasText}>
            <Text style={styles.proficienciasTextBold}>Armaduras:</Text> {treinamentoEProfEquip.armadura.join(', ')}
          </Text>
          <Text style={styles.proficienciasText}>
            <Text style={styles.proficienciasTextBold}>Armas:</Text> {treinamentoEProfEquip.armas.join(', ')}
          </Text>
          <Text style={styles.proficienciasText}>
            <Text style={styles.proficienciasTextBold}>Ferramentas:</Text> {treinamentoEProfEquip.ferramentas.join(', ')}
          </Text>
          
          {/* Exibição de Idiomas */}
          <Text style={styles.proficienciasText}>
            <Text style={styles.proficienciasTextBold}>Idiomas:</Text> {languages.join(', ')}
          </Text>
          
          {/* A edição de proficiências e idiomas é mais complexa e pode ser implementada com um modal ou TextInput grande em editMode */}
          {/* Por enquanto, apenas exibimos. */}
        </View>
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

export default PericiasProficienciasSection;
