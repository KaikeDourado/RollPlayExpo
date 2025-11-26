import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PericiasProficienciasSection = ({
  skills,
  proficiencyBonus,
  equipmentProficiencies,
  languages,
  treinamentoEProfEquip,
  editMode,
  onSave,
}) => {
  const formatModificador = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

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

  const attributeMap = {
    str: 'FOR',
    dex: 'DES',
    con: 'CON',
    int: 'INT',
    wis: 'SAB',
    cha: 'CAR',
  };

  return (
    <View>
      {/* Card de Perícias */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>🎯</Text>
          <Text style={styles.title}>Perícias</Text>
        </View>

        <View style={styles.profBonus}>
          <Text style={styles.profLabel}>Bônus de Proficiência</Text>
          <Text style={styles.profValue}>{formatModificador(proficiencyBonus)}</Text>
        </View>

        <View style={styles.skillsList}>
          {Object.entries(skills).map(([key, skill]) => (
            <TouchableOpacity
              key={key}
              style={styles.skillRow}
              onPress={() => handleToggleProficiency(key)}
              disabled={!editMode}
            >
              <View style={[styles.skillCheck, skill.proficient && styles.skillChecked]}>
                {skill.proficient && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.skillBonus}>{formatModificador(skill.bonus)}</Text>
              <Text style={styles.skillName}>{skillLabels[key]}</Text>
              <Text style={styles.skillAttr}>({attributeMap[skill.ability]})</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Card de Proficiências */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>🛠️</Text>
          <Text style={styles.title}>Proficiências & Idiomas</Text>
        </View>

        <View style={styles.profSection}>
          <Text style={styles.profSectionTitle}>Armaduras</Text>
          <View style={styles.profTags}>
            {treinamentoEProfEquip.armadura.map((item, index) => (
              <View key={index} style={styles.profTag}>
                <Text style={styles.profTagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.profSection}>
          <Text style={styles.profSectionTitle}>Armas</Text>
          <View style={styles.profTags}>
            {treinamentoEProfEquip.armas.map((item, index) => (
              <View key={index} style={styles.profTag}>
                <Text style={styles.profTagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.profSection}>
          <Text style={styles.profSectionTitle}>Ferramentas</Text>
          <View style={styles.profTags}>
            {treinamentoEProfEquip.ferramentas.map((item, index) => (
              <View key={index} style={styles.profTag}>
                <Text style={styles.profTagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.profSection}>
          <Text style={styles.profSectionTitle}>Idiomas</Text>
          <View style={styles.profTags}>
            {languages.map((item, index) => (
              <View key={index} style={[styles.profTag, styles.languageTag]}>
                <Text style={styles.profTagText}>{item}</Text>
              </View>
            ))}
          </View>
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
  skillsList: {
    gap: 4,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#0a0e27',
    marginBottom: 4,
  },
  skillCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2d3653',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillChecked: {
    backgroundColor: '#3b9dff',
    borderColor: '#3b9dff',
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  skillBonus: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    width: 40,
    textAlign: 'center',
  },
  skillName: {
    flex: 1,
    fontSize: 15,
    color: '#ffffff',
    marginLeft: 12,
    fontWeight: '500',
  },
  skillAttr: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  profSection: {
    marginBottom: 16,
  },
  profSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  profTag: {
    backgroundColor: '#0a0e27',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  languageTag: {
    borderColor: '#3b9dff',
  },
  profTagText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default PericiasProficienciasSection;